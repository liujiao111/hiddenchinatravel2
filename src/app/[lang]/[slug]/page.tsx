import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { HubPage } from "@/components/hub-page";
import { LegalPage } from "@/components/legal-page";
import { routing } from "@/i18n/routing";
import { absoluteUrl, getAllContent, getContentBySlug, translationSlug } from "@/lib/content";
import { alternatesFor, robotsFor, type AppLocale } from "@/lib/i18n-seo";

type Props = { params: Promise<{ lang: AppLocale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // A page only gets a /zh URL once its translation exists in the zh content
  // directories — untranslated content 404s under /zh rather than serving
  // English (docs/i18n-plan.md §3).
  return routing.locales.flatMap((lang) =>
    getAllContent(lang).map(({ slug }) => ({ lang, slug })),
  );
}

/** Locales in which this content item genuinely exists, for hreflang. */
function availableLocales(lang: AppLocale, slug: string): AppLocale[] {
  const item = getContentBySlug(slug, lang);
  if (!item) return [lang];
  const otherLang: AppLocale = lang === "en" ? "zh" : "en";
  const available: AppLocale[] = [lang];
  if (getContentBySlug(translationSlug(item), otherLang)) available.push(otherLang);
  return available;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const item = getContentBySlug(slug, lang);
  if (!item) return {};
  const { frontmatter } = item;
  const path = `/${slug}`;
  const alternates = alternatesFor(lang, path, availableLocales(lang, slug));
  const description = frontmatter.metaDescription || frontmatter.excerpt || frontmatter.description;
  const image = frontmatter.ogImage?.url || frontmatter.coverImage || "/home/hero.webp";
  const seoTitle = frontmatter.absoluteSeoTitle || frontmatter.seoTitle || frontmatter.title;
  return {
    title: frontmatter.absoluteSeoTitle ? { absolute: seoTitle } : seoTitle,
    description,
    keywords: frontmatter.keywords,
    robots: robotsFor(lang, path),
    alternates,
    openGraph: {
      type: item.kind === "article" ? "article" : "website",
      title: seoTitle,
      description,
      url: alternates.canonical,
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
      publishedTime: item.kind === "article" ? frontmatter.date : undefined,
      modifiedTime: item.kind === "article" ? frontmatter.dateModified : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { lang, slug } = await params;
  const item = getContentBySlug(slug, lang);
  if (!item) notFound();

  // Tell the header's locale switcher where this page's translation lives;
  // null means "no translation yet" → switch to the other locale's home.
  const otherLang: AppLocale = lang === "en" ? "zh" : "en";
  const otherSlug = translationSlug(item);
  const alternate = {
    [lang]: `/${item.slug}`,
    [otherLang]: getContentBySlug(otherSlug, otherLang) ? `/${otherSlug}` : null,
  } as const;

  if (item.kind === "hub") return <HubPage item={item} alternate={alternate} />;
  if (item.kind === "legal") return <LegalPage item={item} alternate={alternate} />;
  return <ArticlePage item={item} alternate={alternate} />;
}
