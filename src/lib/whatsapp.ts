import { siteConfig } from "./site-config";

// All consultation links share the same draft for the current page language.
export const WHATSAPP_MESSAGE = "Hi Joy, I'd love your help planning a private trip to Yunnan. Here’s what I have in mind so far. I’m open to your suggestions.\n\nWhen we might travel:\nNumber of travelers:\nDays in Yunnan:\nPlaces we’d like to visit:";
const chineseMessage = "你好 Joy，我想咨询云南旅行的路线和报价。这是我的大概计划，未确定的部分想听听你的建议。\n\n出行月份：\n同行人数：\n预计旅行天数：\n感兴趣的地方：";

export function buildWhatsAppUrl(leadId?: string, locale = "en") {
  const draft = locale.startsWith("zh") ? chineseMessage : WHATSAPP_MESSAGE;
  const message = leadId ? `${draft}\n\nRef: ${leadId}` : draft;
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
