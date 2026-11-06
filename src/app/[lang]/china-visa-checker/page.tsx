import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { QuickAsk } from "@/components/quick-ask";
import { UnprefixedLink } from "@/components/unprefixed-link";
import { VisaChecker } from "@/components/travel-tools/visa-checker";
import { getCountrySelectOptions, getPortSelectOptions, getCountryDisplayName } from "@/lib/visa-checker/load-rules";
import { getPhase1CountryEditorials } from "@/lib/visa-checker/country-pages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import "../travel-tools.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "visaChecker" });
  return localizedStaticMetadata(lang, "/china-visa-checker", {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    openGraph: { title: t("meta.ogTitle"), description: t("meta.ogDescription"), url: "/china-visa-checker", type: "website", images: [{ url: "/home/hero.webp" }] },
    twitter: { card: "summary_large_image", title: t("meta.twitterTitle"), description: t("meta.twitterDescription"), images: ["/home/hero.webp"] },
  });
}

export default async function ChinaVisaCheckerPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "visaChecker" });
  const tMobile = await getTranslations({ locale: lang, namespace: "mobileCta" });
  const whatsapp = buildWhatsAppUrl(undefined, lang);
  const countryLinks = getPhase1CountryEditorials();
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];
  return <main><SiteHeader /><header className="tool-hero"><Image src="/assets/blog/do-i-need-a-visa-for-china/cover.webp" alt="Passport and travel documents for a China journey" fill priority unoptimized sizes="100vw" /><div className="tool-hero-shade" /><nav className="breadcrumbs tool-breadcrumb shell"><Link href="/">{t("breadcrumb.home")}</Link><span>›</span><Link href="/survival-kit">{t("breadcrumb.survivalKit")}</Link><span>›</span><span>{t("breadcrumb.current")}</span></nav><div className="shell tool-hero-copy"><span>{t("hero.kicker")}</span><h1>{t("hero.title")}</h1><p>{t("hero.lead")}</p><Link className="button button-light" href="#check-visa">{t("hero.cta")}</Link></div></header>
    <section className="tool-section"><div className="shell tool-main"><VisaChecker countries={getCountrySelectOptions(lang)} ports={getPortSelectOptions(lang)} /><aside className="tool-aside"><span>{t("aside.kicker")}</span><h2>{t("aside.heading")}</h2><p>{t("aside.body")}</p><Link href="/do-i-need-a-visa-for-china">{t("aside.visaLink")}</Link><Link href="/survival-kit">{t("aside.kitLink")}</Link></aside></div></section>
    <section className="tool-section tool-sand" id="countries"><div className="shell"><div className="tool-section-heading"><span>{t("countries.kicker")}</span><h2>{t("countries.heading")}</h2><p>{t("countries.body")}</p></div><div className="tool-country-grid">{countryLinks.map((country) => <UnprefixedLink key={country.slug} lang={lang} href={`/china-visa-checker/${country.slug}`}>{getCountryDisplayName(country.canonicalName, lang)}<span>{t("countries.viewGuide")}</span></UnprefixedLink>)}</div>{lang === "zh" && <p className="tool-section-note">{t("countries.englishOnlyNote")}</p>}</div></section>
    <section className="tool-section" id="official-sources"><div className="shell tool-two-cols"><div><span className="tool-kicker">{t("sources.kicker")}</span><h2>{t("sources.heading")}</h2><p>{t("sources.body")}</p></div><div className="tool-link-list"><a href="https://en.nia.gov.cn/" target="_blank" rel="noopener noreferrer">{t("sources.nia")}</a><a href="https://www.fmprc.gov.cn/mfa_eng/" target="_blank" rel="noopener noreferrer">{t("sources.mfa")}</a><a href="https://www.visaforchina.cn/" target="_blank" rel="noopener noreferrer">{t("sources.visaCentre")}</a></div></div></section>
    <section className="tool-section tool-sand"><div className="shell tool-two-cols"><div><span className="tool-kicker">{t("faq.kicker")}</span><h2>{t("faq.heading")}</h2></div><div className="tool-faq">{faqItems.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></div></section>
    <QuickAsk source="/china-visa-checker" sourceTitle={t("hero.title")} intent="trip" />
    <ContentFooter />
    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
      formCtaLocation="visa_checker_mobile_form"
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: t("hero.title"), url: "https://hiddenchinatravel.com/china-visa-checker", applicationCategory: "TravelApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
  </main>;
}
