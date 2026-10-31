import { useLocale, useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";
import type { ContentItem } from "@/lib/content";
import { localeUrl, type AppLocale, type LocaleAlternate } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { JsonLd, breadcrumbList } from "@/components/json-ld";

export function LegalPage({ item, alternate }: { item: ContentItem; alternate?: LocaleAlternate }) {
  const { frontmatter } = item;
  const locale = useLocale() as AppLocale;
  const t = useTranslations("contentUi");

  return (
    <main>
      <SiteHeader alternate={alternate} />
      <header className="legal-hero">
        <div className="shell legal-hero-inner">
          <nav className="breadcrumbs legal-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">{t("home")}</Link>
            <span aria-hidden="true">›</span>
            <span>{frontmatter.title}</span>
          </nav>
          <p className="legal-eyebrow">{frontmatter.eyebrow || t("legalInformation")}</p>
          <h1>{frontmatter.title}</h1>
          {frontmatter.lastUpdated && <p className="legal-updated">{t("lastUpdated", { date: frontmatter.lastUpdated })}</p>}
        </div>
      </header>
      <article className="legal-content">
        <MarkdownContent>{item.body}</MarkdownContent>
      </article>
      <ContentFooter />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbList([{ name: t("home"), href: localeUrl(locale, "/") }, { name: frontmatter.title, href: localeUrl(locale, `/${item.slug}`) }])] }} />
    </main>
  );
}
