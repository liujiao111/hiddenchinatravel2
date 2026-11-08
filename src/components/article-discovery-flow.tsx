import { getTranslations } from "next-intl/server";
import { CustomJourneyLink } from "@/components/custom-journey-link";
import { Link } from "@/i18n/navigation";
import { PlanJourneyClose } from "@/components/plan-journey-close";
import type { ContentItem } from "@/lib/content";
import type { Journey } from "@/lib/journeys";
import type { AppLocale } from "@/lib/i18n-seo";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import { JourneyQuoteBand } from "@/components/journey-quote-band";
import { siteConfig } from "@/lib/site-config";

function wordCount(body: string) {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

function journeyPrice(journey: Journey, fromLabel: (price: string) => string) {
  const value = new Intl.NumberFormat("en-US").format(journey.frontmatter.fromPrice);
  const currency = journey.frontmatter.currency === "USD" ? "US$" : journey.frontmatter.currency === "CNY" ? "¥" : `${journey.frontmatter.currency} `;
  return fromLabel(`${currency}${value} ${journey.frontmatter.priceBasis}`);
}

export async function ArticleDiscoveryFlow({
  related,
  journey,
  sourceTitle,
  sourceSection,
  sourcePath,
  lang,
}: {
  related: ContentItem[];
  journey?: Journey;
  sourceTitle: string;
  sourceSection?: string;
  sourcePath: string;
  lang: AppLocale;
}) {
  const t = await getTranslations({ locale: lang, namespace: "article" });
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hi Joy, I was reading "${sourceTitle}" and would like some help planning my first trip to China.`)}`;
  const journeyFeatures = [t("journeyPrivate"), t("journeyNoShopping"), t("journeyLocal"), t("journeyFlexible")];
  // Chinese text has no word breaks — count CJK characters as one "word" each.
  const readTime = (body: string) => {
    const raw = body.trim();
    const cjk = (raw.match(/[\u4e00-\u9fff]/g) || []).length;
    const latin = wordCount(raw.replace(/[\u4e00-\u9fff]/g, " "));
    const units = cjk + latin;
    const perMinute = lang === "zh" ? 400 : 220;
    return t("readTime", { minutes: Math.max(1, Math.ceil(units / perMinute)) });
  };

  return <>
    {journey ? <section className="article-discovery article-yunnan">
      <div className="shell article-yunnan-layout">
        <div className="article-yunnan-copy">
          <span>{t("yunnanKicker")}</span>
          <h2>{sourceSection === "China Itinerary Planning" || sourceSection === "中国行程规划" ? t("yunnanHeadingPlanning") : t("yunnanHeadingDefault")}</h2>
          <p>{t("yunnanBody", { route: journey.frontmatter.route.replaceAll(" → ", ", ") })}</p>
          <Link className="button" data-cta-location="article_yunnan" href={`/journeys/${journey.slug}`}>{t("yunnanCta")}</Link>
          <CustomJourneyLink prompt={t("yunnanCustomPrompt")} label={t("yunnanCustomLink")} location="article_custom_alternative" />
          <Link className="article-yunnan-guide-link" href="/china-destinations/yunnan">{t("yunnanGuideLink")}</Link>
        </div>
        <div className="article-featured-journey">
          <JourneyCard journey={{
            title: journey.frontmatter.title,
            subtitle: t("journeySubtitle"),
            href: `/journeys/${journey.slug}`,
            image: journey.frontmatter.coverImage,
            imageAlt: journey.frontmatter.title,
            duration: journey.frontmatter.duration,
            fromPrice: journey.frontmatter.fromPrice > 0 ? journeyPrice(journey, (price) => t("priceFrom", { price })) : t("tailoredQuote"),
            features: journeyFeatures,
            ctaLabel: t("journeyCta"),
            trackingLocation: "article_yunnan",
          }} />
        </div>
      </div>
    </section> : null}

    <JourneyQuoteBand id="ask-joy" source={sourcePath} sourceTitle={sourceTitle} whatsapp={whatsapp} />

    <section className="article-discovery article-explore">
      <div className="shell">
        <header className="article-flow-heading">
          <h2>{t("discoveryTitle")}</h2>
          <p>{t("discoveryIntro")}</p>
        </header>
        <div className="article-guide-grid">
          {related.map((item) => <GuideCard key={item.slug} guide={{
            title: item.frontmatter.title,
            excerpt: item.frontmatter.excerpt,
            href: `/${item.slug}`,
            image: item.frontmatter.coverImage || "/home/hero.webp",
            imageAlt: item.frontmatter.title,
            readTime: readTime(item.body),
            readLabel: t("discoveryReadGuide"),
          }} />)}
        </div>
        <div className="article-secondary-link">
          <span>{t("discoveryPrepLabel")}</span>
          <Link href="/china-travel-essentials">{t("discoveryKitLink")}</Link>
        </div>
      </div>
    </section>

    <PlanJourneyClose id="ask-joy-close" source={sourcePath} sourceTitle={sourceTitle} whatsapp={whatsapp} />
  </>;
}
