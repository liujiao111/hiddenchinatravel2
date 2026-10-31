import { useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";

const topics = [
  { label: "Essentials", href: "/china-travel-essentials", matches: ["essentials", "visa", "planning", "food"] },
  { label: "Payments", href: "/payments-in-china", matches: ["payment"] },
  { label: "Internet", href: "/internet-in-china", matches: ["internet", "vpn", "sim"] },
  { label: "Maps", href: "/maps-navigation-in-china", matches: ["maps", "navigation"] },
  { label: "Transport", href: "/transport-in-china", matches: ["transport"] },
  { label: "Hotels", href: "/hotels-in-china", matches: ["hotel"] },
  { label: "Tickets", href: "/attraction-tickets-in-china", matches: ["ticket", "attraction"] },
];

export function TopicNavigation({ active }: { active?: string }) {
  const t = useTranslations("contentUi");
  const activeTopic = active?.toLowerCase() || "";
  return <nav className="topic-nav" aria-label={t("guideTopicsAria")}>
    <div className="shell topic-nav-inner">
      {topics.map(({ label, href, matches }) => <Link key={href} href={href} className={matches.some((match) => activeTopic.includes(match)) ? "active" : ""}>{t(`topics.${label}`)}</Link>)}
    </div>
  </nav>;
}
