import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({ item }: { item: ContentItem }) {
  const { frontmatter } = item;

  return (
    <main>
      <SiteHeader />
      <header className="legal-hero">
        <div className="shell legal-hero-inner">
          <nav className="breadcrumbs legal-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{frontmatter.title}</span>
          </nav>
          <p className="legal-eyebrow">Legal information</p>
          <h1>{frontmatter.title}</h1>
          {frontmatter.lastUpdated && <p className="legal-updated">Last updated: {frontmatter.lastUpdated}</p>}
        </div>
      </header>
      <article className="legal-content">
        <MarkdownContent>{item.body}</MarkdownContent>
      </article>
      <ContentFooter />
    </main>
  );
}
