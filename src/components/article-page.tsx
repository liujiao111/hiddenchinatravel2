import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { getRelatedArticles } from "@/lib/content";
import { ArticleDiscoveryFlow } from "@/components/article-discovery-flow";
import { ArticleGuideAside } from "@/components/article-guide-aside";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { QuickAsk } from "@/components/quick-ask";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";
import { isTripPlanningSection } from "@/lib/enquiry";
import { getAllJourneys } from "@/lib/journeys";
import { breadcrumbList } from "@/components/json-ld";

function formatDate(value?: string) {
  if (!value) return "Updated for 2026";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function ArticlePage({ item }: { item: ContentItem }) {
  const { frontmatter } = item;
  const related = getRelatedArticles(item, 6);
  const journeys = getAllJourneys();
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
    <SiteHeader />
    <TopicNavigation active={frontmatter.section} />
    <article>
      <header className={frontmatter.coverImage ? "article-hero has-image" : "article-hero"}>
        {frontmatter.coverImage && <Image src={frontmatter.coverImage} alt={frontmatter.coverAlt || frontmatter.title} fill priority unoptimized sizes="100vw" />}
        <div className="article-hero-shade" />
        <nav className="breadcrumbs article-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/china-travel-essentials">Travel guides</Link><span>›</span><span>{frontmatter.title}</span></nav>
        <div className="article-hero-copy shell">
          <h1>{frontmatter.title}</h1>
          <div className="article-byline"><span>By {frontmatter.author?.name || "Joy Liu"}</span><span>Updated {formatDate(frontmatter.dateModified || frontmatter.date)}</span></div>
        </div>
      </header>
      {frontmatter.excerpt && <div className="article-intro shell"><p>{frontmatter.excerpt}</p></div>}
      <QuickAsk source={`/${item.slug}`} sourceTitle={frontmatter.title} intent={isTripPlanningSection(frontmatter.section) ? "trip" : "advice"} />
      <div className="article-layout shell">
        <div className="article-body"><MarkdownContent>{item.body}</MarkdownContent></div>
        <ArticleGuideAside section={frontmatter.section} />
      </div>
    </article>
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">COMMON QUESTIONS</p><h2>Frequently asked questions</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    <ArticleDiscoveryFlow related={related} journey={featuredJourney} sourceTitle={frontmatter.title} sourceSection={frontmatter.section} sourcePath={`/${item.slug}`} />
    <a className="article-mobile-ask" href="#ask-joy">ASK JOY FOR A ROUTE AND PRICE <span>→</span></a>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
