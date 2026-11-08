import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ContentItem } from "@/lib/content";
import { getRelatedArticles } from "@/lib/content";
import type { LocaleAlternate } from "@/lib/i18n-seo";
import type { AppLocale } from "@/lib/i18n-seo";
import { ArticleDiscoveryFlow } from "@/components/article-discovery-flow";
import { ArticleGuideAside } from "@/components/article-guide-aside";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getAllJourneys } from "@/lib/journeys";
import { breadcrumbList } from "@/components/json-ld";

function formatDate(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function ArticlePage({ item, alternate, lang }: { item: ContentItem; alternate?: LocaleAlternate; lang: AppLocale }) {
  const { frontmatter } = item;
  const t = await getTranslations({ locale: lang, namespace: "article" });
  const tMobile = await getTranslations({ locale: lang, namespace: "mobileCta" });
  const whatsapp = buildWhatsAppUrl(undefined, lang === "zh" ? "zh" : "en");
  const related = getRelatedArticles(item, 6, lang);
  const journeys = getAllJourneys(lang);
  const featuredJourney = journeys.find((journey) => journey.frontmatter.featured) || journeys[0];
  const articleJsonLd = {
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: frontmatter.coverImage ? `https://hiddenchinatravel.com${frontmatter.coverImage}` : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.dateModified || frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author?.name || "Joy Liu" },
    publisher: { "@type": "Organization", name: "Hidden China Travel", logo: { "@type": "ImageObject", url: "https://hiddenchinatravel.com/brand/logo.webp" } },
    mainEntityOfPage: `https://hiddenchinatravel.com/${item.slug}`,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      articleJsonLd,
      breadcrumbList([
        { name: "Home", href: "/" },
        { name: "Travel guides", href: "/china-travel-essentials" },
        { name: frontmatter.title, href: `/${item.slug}` },
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
    <TopicNavigation active={frontmatter.section} lang={lang} />
    <article>
      <header className={frontmatter.coverImage ? "article-hero has-image" : "article-hero"}>
        {frontmatter.coverImage && <Image src={frontmatter.coverImage} alt={frontmatter.coverAlt || frontmatter.title} fill priority unoptimized sizes="100vw" />}
        <div className="article-hero-shade" />
        <nav className="breadcrumbs article-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">{t("breadcrumbHome")}</Link><span>›</span><Link href="/china-travel-essentials">{t("breadcrumbGuides")}</Link><span>›</span><span>{frontmatter.title}</span></nav>
        <div className="article-hero-copy shell">
          <h1>{frontmatter.title}</h1>
          <div className="article-byline"><span>{t("by", { name: frontmatter.author?.name || "Joy Liu" })}</span>{(frontmatter.dateModified || frontmatter.date) && <span>{t("updated", { date: formatDate((frontmatter.dateModified || frontmatter.date)!, lang) })}</span>}</div>
        </div>
      </header>
      {frontmatter.excerpt && <div className="article-intro shell"><p>{frontmatter.excerpt}</p></div>}
      <div className="article-layout shell">
        <div className="article-body"><MarkdownContent>{item.body}</MarkdownContent></div>
        <ArticleGuideAside section={frontmatter.section} lang={lang} journey={featuredJourney} />
      </div>
    </article>
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">{t("faqKicker")}</p><h2>{t("faqHeading")}</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    <ArticleDiscoveryFlow related={related} journey={featuredJourney} sourceTitle={frontmatter.title} sourceSection={frontmatter.section} sourcePath={`/${item.slug}`} lang={lang} />
    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
    />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
