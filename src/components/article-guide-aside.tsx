import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/lib/i18n-seo";

export async function ArticleGuideAside({ section, lang }: { section?: string; lang: AppLocale }) {
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
    <article className="article-aside-journey">
      <Link className="article-aside-image" href="/private-yunnan-tours" data-cta-location="article_aside_featured_journey" tabIndex={-1} aria-hidden="true">
        <Image src="/home/hero.webp" alt="" fill sizes="(max-width: 900px) 100vw, 276px" />
      </Link>
      <div className="article-aside-journey-copy">
        <p>{t("privateKicker")}</p>
        <h2>{t("privateTitle")}</h2>
        <span className="article-aside-route">{t("privatePlaces")}</span>
        <span className="article-aside-duration">{t("privateDuration")}</span>
        <small className="article-aside-price-note">{t("privateSummary")}</small>
        <Link className="article-aside-primary" href="/private-yunnan-tours" data-cta-location="article_aside_featured_journey">{t("privateCta")} <span aria-hidden="true">→</span></Link>
        <Link className="article-aside-all-journeys" href="/private-yunnan-tours#plan" data-cta-location="article_aside_all_journeys">{t("privatePlanCta")} →</Link>
      </div>
    </article>
    <div className="article-aside-related">
      <span>{t("asideRelatedLabel")}</span>
      <Link href={hub.href}>{hub.label} →</Link>
      <Link href="/survival-kit">{t("asideKitCta")} →</Link>
    </div>
  </aside>;
}
