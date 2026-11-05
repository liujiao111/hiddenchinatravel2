import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useLocale, useTranslations } from "next-intl";
import { CustomJourneyLink } from "@/components/custom-journey-link";
import { LocaleLink as Link } from "@/components/locale-link";
import { PlanJourneyClose } from "@/components/plan-journey-close";
import type { ContentItem } from "@/lib/content";
import type { Journey } from "@/lib/journeys";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import type { AppLocale } from "@/lib/i18n-seo";

function readingTime(body: string, locale: AppLocale, label: (count: number) => string) {
  const count = locale === "zh"
    ? Math.max(1, Math.ceil(body.replace(/\s/g, "").length / 400))
    : Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 220));
  return label(count);
}

function journeyPrice(journey: Journey, locale: AppLocale) {
  const value = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US").format(journey.frontmatter.fromPrice);
  const currency = journey.frontmatter.currency === "USD" ? "US$" : journey.frontmatter.currency === "CNY" ? "¥" : `${journey.frontmatter.currency} `;
  return locale === "zh" ? `${currency}${value} 起 / 每人` : `From ${currency}${value} ${journey.frontmatter.priceBasis}`;
}

export function ArticleDiscoveryFlow({
  related,
  journey,
  sourceTitle,
  sourceSection,
  sourcePath,
}: {
  related: ContentItem[];
  journey?: Journey;
  sourceTitle: string;
  sourceSection?: string;
  sourcePath: string;
}) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("contentUi");
  const whatsapp = buildWhatsAppUrl();
  const journeyFeatures = [t("privateJourney"), t("noShopping"), t("localExperiences"), t("flexiblePace")];

  return <>
    <section className="article-discovery article-explore">
      <div className="shell">
        <header className="article-flow-heading">
          <h2>{t("continueExploring")}</h2>
          <p>{t("continueIntro")}</p>
        </header>
        <div className="article-guide-grid">
          {related.map((item) => <GuideCard key={item.slug} guide={{
            title: item.frontmatter.title,
            excerpt: item.frontmatter.excerpt,
            href: `/${item.slug}`,
            image: item.frontmatter.coverImage || "/home/hero.webp",
            imageAlt: item.frontmatter.title,
            readTime: readingTime(item.body, locale, (count) => t("minRead", { count })),
          }} />)}
        </div>
        <div className="article-secondary-link">
          <span>{t("preparingFirst")}</span>
          <Link href="/china-travel-essentials">{t("viewSurvival")}</Link>
        </div>
      </div>
    </section>

    {journey ? <section className="article-discovery article-yunnan">
      <div className="shell article-yunnan-layout">
        <div className="article-yunnan-copy">
          <span>{t("seeYunnan")}</span>
          <h2>{sourceSection === "China Itinerary Planning" ? t("routeTogether") : t("practicalAnswered")}</h2>
          <p>{t("followRoute", { route: journey.frontmatter.route.replaceAll(" → ", locale === "zh" ? "、" : ", ") })}</p>
          <Link className="button" data-cta-location="article_yunnan" href={`/journeys/${journey.slug}`}>{t("dayByDay")}</Link>
          <CustomJourneyLink prompt={t("differentRoute")} location="article_custom_alternative" />
          <Link className="article-yunnan-guide-link" href="/china-destinations/yunnan">{t("exploreYunnan")}</Link>
        </div>
        <div className="article-featured-journey">
          <JourneyCard journey={{
            title: journey.frontmatter.title,
            subtitle: t("unhurriedJourney"),
            href: `/journeys/${journey.slug}`,
            image: journey.frontmatter.coverImage,
            imageAlt: journey.frontmatter.title,
            duration: journey.frontmatter.duration,
            fromPrice: journey.frontmatter.fromPrice > 0 ? journeyPrice(journey, locale) : t("tailoredQuote"),
            features: journeyFeatures,
            ctaLabel: t("dayByDay"),
            trackingLocation: "article_yunnan",
          }} />
        </div>
      </div>
    </section> : null}

    <PlanJourneyClose id="ask-joy-close" source={sourcePath} sourceTitle={sourceTitle} whatsapp={whatsapp} />
  </>;
}
