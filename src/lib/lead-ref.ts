import { parseAttribution, type Attribution } from "./attribution";
import { generateLeadId } from "./whatsapp";
import { findWhatsAppSource, safeSiteUrl, saveWhatsAppSource, type SavedWhatsAppSource, type SafeTouch } from "./whatsapp-ref-store";

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
