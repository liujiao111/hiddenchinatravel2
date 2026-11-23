import { createHmac } from "node:crypto";
import { put, BlobPreconditionFailedError } from "@vercel/blob";

// Shared, atomic slots: separate Vercel invocations see the same private Blob state.
// This is a defense in depth. A Vercel edge Firewall rule is still preferred so
// rejected traffic never executes a Serverless Function or writes to storage.
const options = { access: /** @type {const} */ ("private") };
const policies = Object.freeze({
  "driver-checkout": { slots: 6, windowMs: 10 * 60_000 },
  "journey-enquiry": { slots: 12, windowMs: 10 * 60_000 },
  "contact-enquiry": { slots: 12, windowMs: 10 * 60_000 },
});

/** @param {Headers} headers */
function clientAddress(headers) {
  // Vercel-controlled header takes precedence over user-supplied X-Forwarded-For.
  const value = headers.get("x-vercel-forwarded-for") || headers.get("x-real-ip")
    || headers.get("x-forwarded-for")?.split(",").at(-1) || "";
  return value.trim().slice(0, 100) || "unknown";
}

/**
 * @param {Request} request
 * @param {"driver-checkout"|"journey-enquiry"|"contact-enquiry"} policy
 * @returns {Promise<{allowed:boolean,retryAfter:number}>}
 */
export async function checkDriverRateLimit(request, policy) {
  // Node's built-in test runner sets this only for test worker processes.
  // Never touch shared production storage during unit and integration tests.
  if (process.env.NODE_TEST_CONTEXT) return { allowed: true, retryAfter: 0 };
  const config = policies[policy];
  if (!config) throw new Error("Invalid rate limit policy");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Private rate-limit storage unavailable");
  const secret = process.env.DRIVER_ORDER_LINK_SECRET || process.env.WHATSAPP_REF_LOOKUP_SECRET;
  if (!secret || secret.length < 32) throw new Error("Rate-limit signing secret unavailable");
  const now = Date.now();
  const bucket = Math.floor(now / config.windowMs);
  const retryAfter = Math.max(1, Math.ceil(((bucket + 1) * config.windowMs - now) / 1000));
  const addr = clientAddress(request.headers);
  const hash = createHmac("sha256", secret).update(policy + ":" + addr).digest("hex").slice(0, 32);
  const env = process.env.VERCEL_ENV || "development";
  // Distinct opaque paths protect user IP privacy. Immutable create is atomic,
  // so concurrent requests cannot claim the same slot.
  for (let n = 0; n < config.slots; n++) {
    const path = `driver-rate-limit/${env}/${policy}/${bucket}/${hash}/${n}.json`;
    try {
      await put(path, JSON.stringify({ usedAt: now }), {
        ...options, allowOverwrite: false, contentType: "application/json",
      });
      return { allowed: true, retryAfter: 0 };
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) continue;
      throw error;
    }
  }
  return { allowed: false, retryAfter };
}
