import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { getRelatedArticles } from "@/lib/content";
import { ContentCta, ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";

function formatDate(value?: string) {
  if (!value) return "Updated for 2026";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function ArticlePage({ item }: { item: ContentItem }) {
  const { frontmatter } = item;
  const related = getRelatedArticles(item);
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
      <header className="article-header shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/china-travel-essentials">Travel guides</Link><span>›</span><span>{frontmatter.section || "China"}</span></nav>
        <p className="article-section">{frontmatter.section || "China Travel Guide"}</p>
        <h1>{frontmatter.title}</h1>
        {frontmatter.excerpt && <p className="article-deck">{frontmatter.excerpt}</p>}
        <div className="article-byline"><span>By {frontmatter.author?.name || "Joy Liu"}</span><span>Updated {formatDate(frontmatter.dateModified || frontmatter.date)}</span></div>
      </header>
      {frontmatter.coverImage && <div className="article-cover shell"><Image src={frontmatter.coverImage} alt={frontmatter.title} fill priority unoptimized sizes="(max-width: 1100px) 100vw, 1100px" /></div>}
      <div className="article-layout shell">
        <div className="article-body"><MarkdownContent>{item.body}</MarkdownContent></div>
        <aside className="article-aside"><div><p>IN THIS GUIDE</p><span>Practical, independent advice for planning your trip.</span><Link href="/china-travel-essentials">Explore all essentials →</Link></div></aside>
      </div>
    </article>
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">COMMON QUESTIONS</p><h2>Frequently asked questions</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    <section className="related-guides shell"><div className="section-heading"><h2>Related guides</h2><p>Continue preparing for your China journey.</p></div><div className="related-grid">{related.map((relatedItem) => <Link key={relatedItem.slug} href={`/${relatedItem.slug}`}><span>{relatedItem.frontmatter.section || "China travel"}</span><h3>{relatedItem.frontmatter.title}</h3><p>{relatedItem.frontmatter.excerpt}</p><b>READ GUIDE →</b></Link>)}</div></section>
    <ContentCta />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
