import { siteConfig } from "./site-config";

// One template across every page, language and CTA. No marketing data or PII.
export const WHATSAPP_MESSAGE = "Hi Joy, I'd like help planning a private trip to Yunnan.";
export function buildWhatsAppUrl(leadId?: string) {
  const message = leadId ? `${WHATSAPP_MESSAGE}\n\nRef: ${leadId}` : WHATSAPP_MESSAGE;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function isConsultationWhatsApp(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    const number = url.hostname === "wa.me" ? url.pathname.slice(1) :
      ["api.whatsapp.com", "web.whatsapp.com", "www.whatsapp.com", "whatsapp.com"].includes(url.hostname) ? url.searchParams.get("phone") : null;
    return number?.replace(/\D/g, "") === siteConfig.whatsappNumber;
  } catch { return false; }
}
export function generateLeadId(now = new Date()) {
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `HCT-${day}-${crypto.randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase()}`;
}
