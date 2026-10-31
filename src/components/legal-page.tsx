import { Link } from "@/i18n/navigation";
import type { ContentItem } from "@/lib/content";
import type { LocaleAlternate } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { JsonLd, breadcrumbList } from "@/components/json-ld";

export function LegalPage({ item, alternate }: { item: ContentItem; alternate?: LocaleAlternate }) {
  const { frontmatter } = item;

  return (
    <main>
      <SiteHeader alternate={alternate} />
      <header className="legal-hero">
        <div className="shell legal-hero-inner">
          <nav className="breadcrumbs legal-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{frontmatter.title}</span>
          </nav>
          <p className="legal-eyebrow">{frontmatter.eyebrow || "Legal information"}</p>
          <h1>{frontmatter.title}</h1>
          {frontmatter.lastUpdated && <p className="legal-updated">Last updated: {frontmatter.lastUpdated}</p>}
        </div>
      </header>
      <article className="legal-content">
        <MarkdownContent>{item.body}</MarkdownContent>
      </article>
      <ContentFooter />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbList([{ name: "Home", href: "/" }, { name: frontmatter.title, href: `/${item.slug}` }])] }} />
    </main>
  );
}
