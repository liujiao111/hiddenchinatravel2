import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/lib/i18n-seo";

export async function ArticleGuideAside({ section, isTransport, lang }: { section?: string; isTransport: boolean; lang: AppLocale }) {
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
  const hub = (isTransport ? hubs.find(({ href }) => href === "/transport-in-china") : hubs.find(({ terms }) => terms.some(term => normalized.includes(term)))) || {
    label: t("asideHubEssentials"), href: "/china-travel-essentials",
  };

  const productHref = isTransport ? "/yunnan-private-driver#standard-transfers" : "/private-yunnan-tours";
  const productQuoteHref = isTransport ? "/yunnan-private-driver#driver-quote-form" : "/private-yunnan-tours#plan";
  const productTracking = isTransport ? "article_aside_private_driver" : "article_aside_featured_journey";

  return <aside className="article-aside" aria-label={t("asideAria")}>
    <article className="article-aside-journey">
      <Link className="article-aside-image" href={productHref} data-cta-location={productTracking} tabIndex={-1} aria-hidden="true">
        <Image src={isTransport ? "/assets/partners/vehicles/five-seat-toyota.webp" : "/home/hero.webp"} alt="" fill sizes="(max-width: 900px) 100vw, 276px" />
      </Link>
      <div className="article-aside-journey-copy">
        <p>{t(isTransport ? "driverKicker" : "privateKicker")}</p>
        <h2>{t(isTransport ? "driverTitle" : "privateTitle")}</h2>
        <span className="article-aside-route">{t(isTransport ? "driverPlaces" : "privatePlaces")}</span>
        <span className="article-aside-duration">{t(isTransport ? "driverServices" : "privateDuration")}</span>
        <small className="article-aside-price-note">{t(isTransport ? "driverSummary" : "privateSummary")}</small>
        <Link className="article-aside-primary" href={productHref} data-cta-location={productTracking}>{t(isTransport ? "driverCta" : "privateCta")} <span aria-hidden="true">→</span></Link>
        <Link className="article-aside-all-journeys" href={productQuoteHref} data-cta-location={isTransport ? "article_aside_driver_quote" : "article_aside_all_journeys"}>{t(isTransport ? "driverQuoteCta" : "privatePlanCta")} →</Link>
      </div>
    </article>
    <div className="article-aside-related">
      <span>{t("asideRelatedLabel")}</span>
      <Link href={hub.href}>{hub.label} →</Link>
      <Link href="/survival-kit">{t("asideKitCta")} →</Link>
    </div>
  </aside>;
}
