import { siteConfig } from "@/lib/site-config";

const messages = {
  zh: "你好 Joy，我想咨询云南旅行的路线和报价。这是我的大概计划，未确定的部分想听听你的建议。\n\n出行月份：\n同行人数：\n预计旅行天数：\n感兴趣的地方：",
  en: "Hi Joy, I'd love your help planning a private trip to Yunnan. Here’s what I have in mind so far. I’m open to your suggestions.\n\nWhen we might travel:\nNumber of travelers:\nDays in Yunnan:\nPlaces we’d like to visit:",
};

export function consultationHref(locale: string, sourceUrl?: string) {
  const introduction = messages[locale === "zh" ? "zh" : "en"];
  const message = sourceUrl ? introduction + "\n\nPage: " + sourceUrl : introduction;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
