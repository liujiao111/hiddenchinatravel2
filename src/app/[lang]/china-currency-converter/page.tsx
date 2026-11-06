import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { QuickAsk } from "@/components/quick-ask";
import { CurrencyConverter } from "@/components/travel-tools/currency-converter";
import { getExchangeRates } from "@/lib/currency-converter/get-rates";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import "../travel-tools.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "currencyConverter" });
  return localizedStaticMetadata(lang, "/china-currency-converter", {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    openGraph: { title: t("meta.ogTitle"), description: t("meta.ogDescription"), type: "website", url: "/china-currency-converter", images: [{ url: "/home/hero.webp" }] },
    twitter: { card: "summary_large_image", title: t("meta.twitterTitle"), description: t("meta.twitterDescription"), images: ["/home/hero.webp"] },
  });
}

export const revalidate = 3600;

export default async function ChinaCurrencyConverterPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "currencyConverter" });
  const tMobile = await getTranslations({ locale: lang, namespace: "mobileCta" });
  const whatsapp = buildWhatsAppUrl(undefined, lang);
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];
  const quickChecks = t.raw("beforeYouPay.checks") as string[];
  const rates = await getExchangeRates();
  return <main><SiteHeader /><header className="tool-hero"><Image src="/assets/blog/digital-survival-china-payment-guide/cover.webp" alt="Getting ready to pay while traveling in China" fill priority unoptimized sizes="100vw" /><div className="tool-hero-shade" /><nav className="breadcrumbs tool-breadcrumb shell"><Link href="/">{t("breadcrumb.home")}</Link><span>›</span><Link href="/survival-kit">{t("breadcrumb.survivalKit")}</Link><span>›</span><span>{t("breadcrumb.current")}</span></nav><div className="shell tool-hero-copy"><span>{t("hero.kicker")}</span><h1>{t("hero.title")}</h1><p>{t("hero.lead")}</p><Link className="button button-light" href="#convert">{t("hero.cta")}</Link></div></header>
    <section className="tool-section"><div className="shell tool-main"><CurrencyConverter initialRates={rates} /><aside className="tool-aside"><span>{t("aside.kicker")}</span><h2>{t("aside.heading")}</h2><p>{t("aside.body")}</p><Link href="/payments-in-china">{t("aside.paymentLink")}</Link><Link href="/alipay-for-foreigners-china">{t("aside.alipayLink")}</Link></aside></div></section>
    <section className="tool-section tool-sand"><div className="shell tool-two-cols"><div><span className="tool-kicker">{t("beforeYouPay.kicker")}</span><h2>{t("beforeYouPay.heading")}</h2><p>{t("beforeYouPay.body")}</p></div><div className="tool-info-card"><h3>{t("beforeYouPay.checksTitle")}</h3><ol>{quickChecks.map((check) => <li key={check}>{check}</li>)}</ol><Link href="/survival-kit">{t("beforeYouPay.kitLink")}</Link></div></div></section>
    <section className="tool-section"><div className="shell tool-two-cols"><div><span className="tool-kicker">{t("faq.kicker")}</span><h2>{t("faq.heading")}</h2></div><div className="tool-faq">{faqItems.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></div></section>
    <QuickAsk source="/china-currency-converter" sourceTitle={t("hero.title")} intent="advice" />
    <ContentFooter />
    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
      formCtaLocation="currency_converter_mobile_form"
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: t("hero.title"), url: "https://hiddenchinatravel.com/china-currency-converter", applicationCategory: "FinanceApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
  </main>;
}
