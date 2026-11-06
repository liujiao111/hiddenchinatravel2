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
    <div>
      <p>{t("asideKicker")}</p>
      <h2>{t("asideHeading")}</h2>
      <span>{t("asideBody")}</span>
      <Link className="article-aside-primary" href="/survival-kit">{t("asideKitCta")} <span aria-hidden="true">→</span></Link>
      <div className="article-aside-related"><span>{t("asideRelatedLabel")}</span><Link href={hub.href}>{hub.label} →</Link></div>
    </div>
    <div className="article-aside-ask">
      <p>{t("asideAskKicker")}</p>
      <h2>{t("asideAskHeading")}</h2>
      <span>{t("asideAskBody")}</span>
      <a className="article-aside-primary" href="#ask-joy">{t("asideAskCta")} <span aria-hidden="true">→</span></a>
    </div>
  </aside>;
}
