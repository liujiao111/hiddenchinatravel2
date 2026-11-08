import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/lib/i18n-seo";
import type { Journey } from "@/lib/journeys";
import { formatPriceLabel } from "@/lib/format-price";

export async function ArticleGuideAside({ section, lang, journey }: { section?: string; lang: AppLocale; journey?: Journey }) {
  const t = await getTranslations({ locale: lang, namespace: "article" });

  const hubs = [
    { terms: ["payment"], label: t("asideHubPayments"), href: "/payments-in-china" },
    { terms: ["internet", "vpn", "sim"], label: t("asideHubInternet"), href: "/internet-in-china" },
    { terms: ["maps", "navigation"], label: t("asideHubMaps"), href: "/maps-navigation-in-china" },
    { terms: ["transport", "train"], label: t("asideHubTransport"), href: "/transport-in-china" },
    { terms: ["hotel"], label: t("asideHubHotels"), href: "/hotels-in-china" },
    { terms: ["attraction", "ticket"], label: t("asideHubAttractions"), href: "/attraction-tickets-in-china" },
    { terms: ["food", "delivery"], label: t("asideHubFood"), href: "/food-delivery-in-china" },
    { terms: ["itinerary", "planning"], label: t("asideHubItinerary"), href: "/china-itinerary-planning" },
  ];

  const normalized = section?.toLowerCase() || "";
  const hub = hubs.find(({ terms }) => terms.some(term => normalized.includes(term))) || {
    label: t("asideHubEssentials"), href: "/china-travel-essentials",
  };

  return <aside className="article-aside" aria-label={t("asideAria")}>
    {journey ? <article className="article-aside-journey">
      <Link className="article-aside-image" href={`/journeys/${journey.slug}`} data-cta-location="article_aside_featured_journey" tabIndex={-1} aria-hidden="true">
        <Image src={journey.frontmatter.coverImage} alt="" fill sizes="(max-width: 900px) 100vw, 276px" />
      </Link>
      <div className="article-aside-journey-copy">
        <p>{t("asideJourneyKicker")}</p>
        <h2>{journey.frontmatter.title}</h2>
        <span className="article-aside-route">{journey.frontmatter.route.replaceAll(" → ", " · ")}</span>
        <span className="article-aside-duration">{journey.frontmatter.duration}</span>
        {journey.frontmatter.fromPrice > 0 ? <strong className="article-aside-price">{t("asidePriceFrom", { price: formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency), basis: journey.frontmatter.priceBasis })}</strong> : null}
        {journey.frontmatter.heroNote ? <small className="article-aside-price-note">{journey.frontmatter.heroNote}</small> : null}
        <Link className="article-aside-primary" href={`/journeys/${journey.slug}`} data-cta-location="article_aside_featured_journey">{t("asideJourneyCta")} <span aria-hidden="true">→</span></Link>
        <Link className="article-aside-all-journeys" href="/journeys" data-cta-location="article_aside_all_journeys">{t("asideAllJourneys")} →</Link>
      </div>
    </article> : null}
    <div className="article-aside-related">
      <span>{t("asideRelatedLabel")}</span>
      <Link href={hub.href}>{hub.label} →</Link>
      <Link href="/survival-kit">{t("asideKitCta")} →</Link>
    </div>
  </aside>;
}
