import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";
import type { ContentItem } from "@/lib/content";
import { getRelatedArticles } from "@/lib/content";
import { htmlLang, localeUrl, type AppLocale, type LocaleAlternate } from "@/lib/i18n-seo";
import { ArticleDiscoveryFlow } from "@/components/article-discovery-flow";
import { ArticleGuideAside } from "@/components/article-guide-aside";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { QuickAsk } from "@/components/quick-ask";
import { JourneyQuoteBand } from "@/components/journey-quote-band";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";
import { isTripPlanningSection } from "@/lib/enquiry";
import { getAllJourneys } from "@/lib/journeys";
import { breadcrumbList } from "@/components/json-ld";

function formatDate(value: string | undefined, locale: AppLocale, fallback: string) {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function ArticlePage({ item, alternate }: { item: ContentItem; alternate?: LocaleAlternate }) {
  const { frontmatter } = item;
  const locale = useLocale() as AppLocale;
  const t = useTranslations("contentUi");
  const related = getRelatedArticles(item, 6, locale);
  const journeys = getAllJourneys(locale);
  const featuredJourney = journeys.find((journey) => journey.frontmatter.featured) || journeys[0];
  const articleJsonLd = {
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    inLanguage: htmlLang[locale],
    image: frontmatter.coverImage ? `https://hiddenchinatravel.com${frontmatter.coverImage}` : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.dateModified || frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author?.name || "Joy Liu" },
    publisher: { "@type": "Organization", name: "Hidden China Travel", logo: { "@type": "ImageObject", url: "https://hiddenchinatravel.com/brand/logo.webp" } },
    mainEntityOfPage: localeUrl(locale, `/${item.slug}`),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      articleJsonLd,
      breadcrumbList([
        { name: t("home"), href: localeUrl(locale, "/") },
        { name: t("travelGuides"), href: localeUrl(locale, "/china-travel-essentials") },
        { name: frontmatter.title, href: localeUrl(locale, `/${item.slug}`) },
      ]),
      ...(frontmatter.faqs?.length ? [{
        "@type": "FAQPage",
        mainEntity: frontmatter.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }] : []),
    ],
  };

  return <main>
    <SiteHeader alternate={alternate} />
    <TopicNavigation active={frontmatter.section} />
    <article>
      <header className={frontmatter.coverImage ? "article-hero has-image" : "article-hero"}>
        {frontmatter.coverImage && <Image src={frontmatter.coverImage} alt={frontmatter.coverAlt || frontmatter.title} fill priority unoptimized sizes="100vw" />}
        <div className="article-hero-shade" />
        <nav className="breadcrumbs article-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">{t("home")}</Link><span>›</span><Link href="/china-travel-essentials">{t("travelGuides")}</Link><span>›</span><span>{frontmatter.title}</span></nav>
        <div className="article-hero-copy shell">
          <h1>{frontmatter.title}</h1>
          <div className="article-byline"><span>{t("by", { name: frontmatter.author?.name || "Joy Liu" })}</span><span>{t("updated", { date: formatDate(frontmatter.dateModified || frontmatter.date, locale, t("updatedFor2026")) })}</span></div>
        </div>
      </header>
      {frontmatter.excerpt && <div className="article-intro shell"><p>{frontmatter.excerpt}</p></div>}
      {isTripPlanningSection(frontmatter.section)
        ? <JourneyQuoteBand id="ask-joy" source={`/${item.slug}`} sourceTitle={frontmatter.title} />
        : <QuickAsk source={`/${item.slug}`} sourceTitle={frontmatter.title} intent="advice" />}
      <div className="article-layout shell">
        <div className="article-body"><MarkdownContent>{item.body}</MarkdownContent></div>
        <ArticleGuideAside section={frontmatter.section} />
      </div>
    </article>
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">{t("commonQuestions")}</p><h2>{t("faqHeading")}</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    <ArticleDiscoveryFlow related={related} journey={featuredJourney} sourceTitle={frontmatter.title} sourceSection={frontmatter.section} sourcePath={`/${item.slug}`} />
    <a className="article-mobile-ask" href="#ask-joy">{t("askRoutePrice")} <span>→</span></a>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
