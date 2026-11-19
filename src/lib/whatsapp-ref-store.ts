import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// Minimal Vercel Blob REST adapter. Reuses the project's existing blob token,
// without adding a database or new npm dependencies. Records are AES-GCM
// encrypted before upload into the existing private Vercel Blob store.
export const WHATSAPP_REF_PATTERN = /^HCT-\d{8}-[A-F0-9]{16}$/;
const PREFIX = "private-lead-attribution/v1/";
const API_VERSION = "12";
const MAX_BLOB_BYTES = 12_000;

export type SavedWhatsAppSource = {
  ref: string;
  status: "whatsapp_click_unconfirmed";
  captured_at: string;
  conversion_page: string;
  conversion_url: string;
  whatsapp_location: string;
  first: SafeTouch;
  last: SafeTouch;
  session: SafeTouch;
};

export type SafeTouch = {
  source: string;
  medium: string;
  source_label: string;
  landing_page: string;
  referrer: string;
  time: string;
  params: Record<string, string>;
};

const allowedParams = new Set([
  "gclid", "gbraid", "wbraid", "msclkid", "fbclid", "utm_source",
  "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content",
]);
const str = (value: unknown, max = 160) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, max) : "";

function isSiteHost(host: string) {
  return host === "hiddenchinatravel.com" ||
    host === "www.hiddenchinatravel.com" ||
    (host.endsWith(".vercel.app") && /^[a-z\d.-]+$/.test(host));
}

// A conversion URL retains its path and campaign query params, not possible
// traveller PII / auth tokens attached by other pages.
export function safeSiteUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.length > 5000) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !isSiteHost(url.hostname)) return "";
    url.username = "";
    url.password = "";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (!allowedParams.has(key)) url.searchParams.delete(key);
    }
    return url.toString().slice(0, 2400);
  } catch {
    return "";
  }
}

function touch(raw: unknown): SafeTouch {
  const source = typeof raw === "object" && raw !== null ? raw as Record<string, unknown> : {};
  const rawParams = typeof source.params === "object" && source.params !== null
    ? source.params as Record<string, unknown> : {};
  const params: Record<string, string> = {};
  for (const key of allowedParams) {
    const value = str(rawParams[key]);
    if (value) params[key] = value;
  }
  return {
    source: str(source.source),
    medium: str(source.medium),
    source_label: str(source.source_label),
    landing_page: str(source.landing_page, 500),
    referrer: str(source.referrer, 500),
    time: str(source.time, 40),
    params,
  };
}

export function parseWhatsAppSource(input: unknown): SavedWhatsAppSource | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  const ref = str(data.ref, 60).toUpperCase();
  const conversionUrl = safeSiteUrl(data.conversion_url);
  const capturedAt = str(data.captured_at, 40);
  const when = Date.parse(capturedAt);
  if (!WHATSAPP_REF_PATTERN.test(ref) || !conversionUrl ||
      !Number.isFinite(when) || Math.abs(Date.now() - when) > 10 * 60 * 1000) return null;
  return {
    ref, status: "whatsapp_click_unconfirmed", captured_at: new Date(when).toISOString(),
    conversion_page: new URL(conversionUrl).pathname,
    conversion_url: conversionUrl,
    whatsapp_location: str(data.whatsapp_location, 80),
    first: touch(data.first), last: touch(data.last), session: touch(data.session),
  };
}

function credentials() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || "";
  const storeId = token.split("_")[3] || "";
  if (!token || !/^[a-zA-Z0-9]+$/.test(storeId)) throw new Error("Blob storage not configured");
  return { token, storeId };
}
function cipherKey(token: string) {
  // Rotating the Blob token requires migrating/re-encrypting existing records.
  return createHash("sha256").update("hct-source-record-v1:").update(token).digest();
}
function blobPath(ref: string) {
  return `${PREFIX}${ref}.bin`;
}
export function encryptRecord(record: SavedWhatsAppSource, token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cipherKey(token), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(record), "utf8"), cipher.final()]);
  return Buffer.concat([Buffer.from("HCTR1"), iv, cipher.getAuthTag(), encrypted]);
}
export function decryptRecord(payload: Buffer, token: string): SavedWhatsAppSource {
  if (payload.length < 34 || payload.subarray(0, 5).toString() !== "HCTR1")
    throw new Error("Invalid record format");
  const decipher = createDecipheriv("aes-256-gcm", cipherKey(token), payload.subarray(5, 17));
  decipher.setAuthTag(payload.subarray(17, 33));
  const plain = Buffer.concat([decipher.update(payload.subarray(33)), decipher.final()]);
  return JSON.parse(plain.toString("utf8")) as SavedWhatsAppSource;
}

export async function saveWhatsAppSource(record: SavedWhatsAppSource) {
  const { token, storeId } = credentials();
  const blob = encryptRecord(record, token);
  // Follow the Vercel Blob SDK wire protocol. The request-ID and attempt
  // headers are required for traceability and error classification by Blob.
  const res = await fetch(`https://vercel.com/api/blob/?pathname=${encodeURIComponent(blobPath(record.ref))}`, {
    method: "PUT", cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
      "x-api-blob-request-id": `${storeId}:${Date.now()}:${randomBytes(8).toString("hex")}`,
      "x-api-blob-request-attempt": "0",
      "x-vercel-blob-store-id": storeId,
      "x-api-version": API_VERSION,
      "x-vercel-blob-access": "private",
      "x-add-random-suffix": "0",
      "x-allow-overwrite": "0",
      "x-content-type": "application/octet-stream",
    },
    body: blob,
    signal: AbortSignal.timeout(7000),
  });
  // The service returns a structured reason (e.g. wrong access mode) for a
  // 400. Log only the short upstream error code/message, never secrets or
  // customer attribution, so a future storage misconfiguration is diagnosable.
  if (res.status === 409) return; // Idempotent, don't overwrite the first click.
  if (!res.ok) {
    let detail = "";
    try {
      const payload = await res.json() as { error?: { code?: unknown; message?: unknown } };
      const code = typeof payload.error?.code === "string" ? payload.error.code : "";
      const message = typeof payload.error?.message === "string" ? payload.error.message : "";
      detail = ` ${code.slice(0, 60)}: ${message.slice(0, 220)}`;
    } catch { /* no structured response */ }
    throw new Error(`Blob record write failed: ${res.status}${detail}`);
  }
}

export async function findWhatsAppSource(ref: string): Promise<SavedWhatsAppSource | null> {
  if (!WHATSAPP_REF_PATTERN.test(ref)) return null;
  const { token, storeId } = credentials();
  const res = await fetch(`https://${storeId}.private.blob.vercel-storage.com/${blobPath(ref)}?cache=0`, {
    cache: "no-store", headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(7000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Blob record lookup failed: ${res.status}`);
  if (Number(res.headers.get("content-length")) > MAX_BLOB_BYTES) throw new Error("Oversized record");
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length > MAX_BLOB_BYTES) throw new Error("Oversized record");
  const record = decryptRecord(bytes, token);
  if (record.ref !== ref) throw new Error("Mismatched reference");
  return record;
}
