import { siteConfig } from "./site-config";

// Centralized localized consultation templates. No personal details are inserted automatically.
export const WHATSAPP_MESSAGE = "Hi Joy, I'm interested in planning a private Yunnan trip.\n\nWe're thinking of traveling in:\nNumber of travelers:\nApproximate trip length:\nPlaces we'd love to visit:\n\nI'd appreciate your suggestions. Thanks!";
export const WHATSAPP_MESSAGE_ZH = "你好 Joy，我想了解云南私人定制旅行。\n\n大概出行月份：\n同行人数：\n预计旅行天数：\n感兴趣的地方：\n\n麻烦帮我看看可以怎么安排，谢谢！";
export function buildWhatsAppUrl(leadId?: string, locale: "en" | "zh" = "en") {
  const base = locale === "zh" ? WHATSAPP_MESSAGE_ZH : WHATSAPP_MESSAGE;
  const message = leadId ? `${base}\n\nRef: ${leadId}` : base;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export type WhatsAppSourceDetails = {
  sourcePageUrl: string;
  channel: string;
  firstLandingUrl?: string;
  firstChannel?: string;
};

// Preserve the visitor's page-specific enquiry, replacing only our previous
// reference/source block on a subsequent click. The extra context is included
// in the prefilled message because GA4 alone cannot be looked up in WhatsApp.
export function withWhatsAppRef(
  raw: string, leadId: string, locale: "en" | "zh" = "en", source?: WhatsAppSourceDetails,
) {
  const url = new URL(raw);
  const original = (url.searchParams.get("text") || "")
    .replace(/(?:\r?\n)*Ref: HCT-\d{8}-[A-F0-9]{16}(?:\r?\n(?:Source page|Channel|First landing|First channel):[^\r\n]*)*\s*$/i, "")
    .trim();
  const fallback = locale === "zh" ? WHATSAPP_MESSAGE_ZH : WHATSAPP_MESSAGE;
  const details = [`Ref: ${leadId}`];
  if (source) {
    details.push(`Source page: ${source.sourcePageUrl}`, `Channel: ${source.channel}`);
    if (source.firstLandingUrl && source.firstLandingUrl !== source.sourcePageUrl)
      details.push(`First landing: ${source.firstLandingUrl}`);
    if (source.firstChannel && source.firstChannel !== source.channel)
      details.push(`First channel: ${source.firstChannel}`);
  }
  url.searchParams.set("text", `${original || fallback}\n\n${details.join("\n")}`);
  return url.toString();
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
