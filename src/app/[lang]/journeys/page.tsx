import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { QuickAsk } from "@/components/quick-ask";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { getAllJourneys } from "@/lib/journeys";
import { formatPriceLabel } from "@/lib/format-price";
import { JsonLd, breadcrumbList } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "journeys" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return localizedStaticMetadata(lang, "/journeys", {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://hiddenchinatravel.com/journeys",
      type: "website",
      images: [{ url: "/home/hero.webp", alt: t("ogImageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/home/hero.webp"],
    },
  });
}

export default async function JourneysPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "journeys" });
  const journeys = getAllJourneys(lang);
  return <main>
    <SiteHeader />
    <header className="journeys-hero"><div className="narrow"><p>{t("heroKicker")}</p><h1>{t("heroTitle")}</h1><span>{t("heroIntro")}</span></div></header>
    <section className="journeys-list section"><div className="shell"><div className="section-heading"><h2>{t("listHeading")}</h2><p>{t("listIntro")}</p></div><div className="journeys-card-grid">{journeys.map((journey) => <JourneyCard key={journey.slug} priority={journey.frontmatter.featured} journey={{
      title: journey.frontmatter.shortTitle,
      subtitle: journey.frontmatter.excerpt,
      href: `/journeys/${journey.slug}`,
      image: journey.frontmatter.coverImage,
      imageAlt: journey.frontmatter.title,
      destination: journey.frontmatter.route,
      duration: journey.frontmatter.duration,
      fromPrice: journey.frontmatter.fromPrice > 0
        ? t("priceFrom", { price: formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency), basis: journey.frontmatter.priceBasis })
        : t("tailoredQuote"),
    }} />)}</div>
      <aside className="journeys-tailor-made" aria-labelledby="journeys-tailor-made-title">
        <div><span>{t("customKicker")}</span><h2 id="journeys-tailor-made-title">{t("customTitle")}</h2></div>
        <div><p>{t("customText")}</p><ul>{(t.raw("customPoints") as string[]).map((point) => <li key={point}>{point}</li>)}</ul><Link href="/custom-china-tour" data-cta-location="journeys_custom_service" className="button button-light">{t("customCta")}</Link></div>
      </aside>
    </div></section>
    <section className="journeys-philosophy section-sand"><div className="shell"><h2>{t("philosophyHeading")}</h2><div>{(t.raw("philosophyPoints") as string[]).map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}</div></div></section>
    <QuickAsk source="/journeys" sourceTitle={t("quickAskSourceTitle")} intent="trip" />
    <ContentFooter />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "CollectionPage", name: t("metaTitle"), description: t("metaDescription"), url: "https://hiddenchinatravel.com/journeys" },
        breadcrumbList([{ name: t("breadcrumbHome"), href: "/" }, { name: t("breadcrumbCurrent"), href: "/journeys" }]),
      ],
    }} />
  </main>;
}
