import { analyticsDenied, getAttribution, parseAttribution, type Attribution } from "./attribution";
import { generateLeadId } from "./whatsapp";
import { findWhatsAppSource, parseWhatsAppSource, safeSiteUrl, saveWhatsAppSource, type SavedWhatsAppSource, type SafeTouch } from "./whatsapp-ref-store";

// Browser helper: never send traveller details to the attribution store or GA.
export function createFormTracking(ref: string, formName: string, productId = "") {
  const allowed = !analyticsDenied();
  return {
    ref, form_name: formName, product_id: productId,
    conversion_url: allowed ? window.location.href : window.location.origin + window.location.pathname,
    ...(allowed ? { attribution: getAttribution() } : {}),
  };
}

const unknownTouch = (): SafeTouch => ({
  source: "unknown", medium: "unknown", source_label: "Unknown",
  landing_page: "", referrer: "", time: "", params: {},
});
const clean = (value: unknown, limit = 100) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, limit) : "";

export function prepareFormRecord(
  value: unknown, fallbackUrl: string, formName: string, submissionId = "", productId = "",
): SavedWhatsAppSource {
  const data = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const browserRef = clean(data.ref, 60).toUpperCase();
  const ref = /^HCT-\d{8}-[A-F0-9]{16}$/.test(browserRef) ? browserRef : generateLeadId();
  const conversionUrl = safeSiteUrl(data.conversion_url) || safeSiteUrl(fallbackUrl) || "https://hiddenchinatravel.com/";
  const attr = parseAttribution(data.attribution) as Attribution | null;
  return {
    ref, status: "form_submitted", channel: "form",
    captured_at: new Date().toISOString(),
    conversion_page: new URL(conversionUrl).pathname,
    conversion_url: conversionUrl,
    whatsapp_location: "",
    first: attr?.first || unknownTouch(),
    last: attr?.last || unknownTouch(),
    session: attr?.session || unknownTouch(),
    form_name: clean(formName, 80),
    form_submission_id: clean(submissionId, 80),
    product_id: clean(productId || data.product_id, 100),
  };
}

export async function saveFormRecord(record: SavedWhatsAppSource) {
  // An email accepted by Resend is the business lead; Blob attribution is
  // secondary. A Blob outage must never cause a user to re-send an accepted form.
  try {
    await saveWhatsAppSource(record);
  } catch (error) {
    console.error("Lead Ref attribution save failed", record.status,
      error instanceof Error ? error.message : "unknown");
  }
}

export function createPassiveRecord(
  ref: string,
  status: "qr_view" | "qr_download" | "wechat_id_copy",
  channel: "whatsapp" | "wechat",
) {
  if (analyticsDenied()) return null;
  const attr = getAttribution();
  return {
    ref, status, channel,
    captured_at: new Date().toISOString(),
    conversion_url: window.location.href,
    whatsapp_location: "floating_contact",
    first: attr.first, last: attr.last, session: attr.session,
  };
}

export function savePassiveRecord(payload: ReturnType<typeof createPassiveRecord>) {
  if (!payload) return;
  const body = JSON.stringify(payload);
  try {
    const blob = new Blob([body], { type: "application/json" });
    const queued = typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/whatsapp-ref", blob);
    if (!queued) void fetch("/api/whatsapp-ref", {
      method: "POST", headers: { "content-type": "application/json" },
      body, keepalive: true, credentials: "same-origin",
    }).catch(() => {});
  } catch { /* QR actions must remain usable */ }
}

// An old successful WhatsApp Ref remains readable; no migration is needed.
export async function lookupLeadSource(ref: string) {
  return findWhatsAppSource(ref);
}

export function createServerScanRecord(parent: SavedWhatsAppSource, ref: string): SavedWhatsAppSource {
  return {
    ...parent, ref, status: "qr_link_open", channel: "whatsapp",
    captured_at: new Date().toISOString(), whatsapp_location: "pc_qr_scan",
    parent_ref: parent.ref,
  };
}
