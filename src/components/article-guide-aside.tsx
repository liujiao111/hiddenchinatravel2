import { useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";

const hubs = [
  { terms: ["payment"], label: "Payments in China", href: "/payments-in-china" },
  { terms: ["internet", "vpn", "sim"], label: "Internet in China", href: "/internet-in-china" },
  { terms: ["maps", "navigation"], label: "Maps & navigation", href: "/maps-navigation-in-china" },
  { terms: ["transport", "train"], label: "Transport in China", href: "/transport-in-china" },
  { terms: ["hotel"], label: "Hotels in China", href: "/hotels-in-china" },
  { terms: ["attraction", "ticket"], label: "Attraction tickets", href: "/attraction-tickets-in-china" },
  { terms: ["food", "delivery"], label: "Food & delivery", href: "/food-delivery-in-china" },
  { terms: ["itinerary", "planning"], label: "Itinerary planning", href: "/china-itinerary-planning" },
];

export function ArticleGuideAside({ section }: { section?: string }) {
  const t = useTranslations("contentUi");
  const normalized = section?.toLowerCase() || "";
  const hub = hubs.find(({ terms }) => terms.some(term => normalized.includes(term))) || {
    label: "China travel essentials", href: "/china-travel-essentials",
  };

  return <aside className="article-aside" aria-label={t("planChinaAria")}>
    <div>
      <p>{t("prepareChina")}</p>
      <h2>{t("prepareTitle")}</h2>
      <span>{t("prepareText")}</span>
      <Link className="article-aside-primary" href="/survival-kit">{t("openSurvival")} <span aria-hidden="true">→</span></Link>
      <div className="article-aside-related"><span>{t("readMoreTopic")}</span><Link href={hub.href}>{t(`topics.${hub.label}`)} →</Link></div>
    </div>
    <div className="article-aside-ask">
      <p>{t("privateYunnanTrip")}</p>
      <h2>{t("wantRoutePrice")}</h2>
      <span>{t("datesGroupEnough")}</span>
      <a className="article-aside-primary" href="#ask-joy">{t("askJoy")} <span aria-hidden="true">→</span></a>
    </div>
  </aside>;
}
