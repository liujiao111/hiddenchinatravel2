import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/lib/i18n-seo";
import { WhatsAppRedirect } from "@/components/whatsapp-redirect";

export const metadata: Metadata = {
  title: "Chat with Joy on WhatsApp",
  description: "Continue your Yunnan trip enquiry with Joy on WhatsApp.",
  robots: { index: false, follow: false },
};

export default async function WhatsAppPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  return <WhatsAppRedirect locale={lang === "zh" ? "zh" : "en"} />;
}
