import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { getRelatedArticles } from "@/lib/content";
import { ArticleDiscoveryFlow } from "@/components/article-discovery-flow";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";
import { getAllJourneys } from "@/lib/journeys";

function formatDate(value?: string) {
  if (!value) return "Updated for 2026";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function ArticlePage({ item }: { item: ContentItem }) {
  const { frontmatter } = item;
  const related = getRelatedArticles(item, 6);
  const journeys = getAllJourneys();
  const featuredJourney = journeys.find((journey) => journey.frontmatter.featured) || journeys[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: frontmatter.coverImage ? `https://hiddenchinatravel.com${frontmatter.coverImage}` : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.dateModified || frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author?.name || "Joy Liu" },
    publisher: { "@type": "Organization", name: "Hidden China Travel" },
  };

  return <main>
    <SiteHeader />
    <TopicNavigation active={frontmatter.section} />
    <article>
      <nav className="breadcrumbs article-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/china-travel-essentials">Travel guides</Link><span>›</span><span>{frontmatter.title}</span></nav>
      <header className={frontmatter.coverImage ? "article-hero has-image" : "article-hero"}>
        {frontmatter.coverImage && <Image src={frontmatter.coverImage} alt={frontmatter.title} fill priority unoptimized sizes="100vw" />}
        <div className="article-hero-shade" />
        <div className="article-hero-copy shell">
          <h1>{frontmatter.title}</h1>
          <div className="article-byline"><span>By {frontmatter.author?.name || "Joy Liu"}</span><span>Updated {formatDate(frontmatter.dateModified || frontmatter.date)}</span></div>
        </div>
      </header>
      {frontmatter.excerpt && <div className="article-intro shell"><p>{frontmatter.excerpt}</p></div>}
      <div className="article-layout shell">
        <div className="article-body"><MarkdownContent>{item.body}</MarkdownContent></div>
        <aside className="article-aside"><div><p>IN THIS GUIDE</p><span>Practical, independent advice for planning your trip.</span><Link href="/china-travel-essentials">Explore all essentials →</Link></div></aside>
      </div>
    </article>
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">COMMON QUESTIONS</p><h2>Frequently asked questions</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    <ArticleDiscoveryFlow related={related} journey={featuredJourney} sourceTitle={frontmatter.title} />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
