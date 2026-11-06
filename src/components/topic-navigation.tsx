import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/lib/i18n-seo";

const topics = [
  { key: "essentials", href: "/china-travel-essentials", matches: ["essentials", "visa", "planning", "food"] },
  { key: "payments", href: "/payments-in-china", matches: ["payment"] },
  { key: "internet", href: "/internet-in-china", matches: ["internet", "vpn", "sim"] },
  { key: "maps", href: "/maps-navigation-in-china", matches: ["maps", "navigation"] },
  { key: "transport", href: "/transport-in-china", matches: ["transport"] },
  { key: "hotels", href: "/hotels-in-china", matches: ["hotel"] },
  { key: "tickets", href: "/attraction-tickets-in-china", matches: ["ticket", "attraction"] },
] as const;

export async function TopicNavigation({ active, lang }: { active?: string; lang: AppLocale }) {
  const t = await getTranslations({ locale: lang, namespace: "topicNav" });
  const activeTopic = active?.toLowerCase() || "";
  return <nav className="topic-nav" aria-label={t("aria")}>
    <div className="shell topic-nav-inner">
      {topics.map(({ key, href, matches }) => <Link key={href} href={href} className={matches.some((match) => activeTopic.includes(match)) ? "active" : ""}>{t(key)}</Link>)}
    </div>
  </nav>;
}
