import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Faq = { question: string; answer: string };
export type HubArticle = { title: string; href: string; excerpt: string; badge?: string; status?: string };
export type HubSubtopic = { id: string; name: string; description?: string; articles?: HubArticle[] };

export type ContentFrontmatter = {
  type?: "hub" | "legal";
  status?: "draft" | "review" | "published";
  /** Slug of the paired translation in the other language. */
  translationKey?: string;
  title: string;
  seoTitle?: string;
  absoluteSeoTitle?: string;
  excerpt?: string;
  metaDescription?: string;
  description?: string;
  heroAnswer?: string;
  eyebrow?: string;
  coverImage?: string;
  coverAlt?: string;
  canonical?: string;
  date?: string;
  dateModified?: string;
  lastUpdated?: string;
  section?: string;
  keywords?: string[];
  author?: { name?: string; picture?: string };
  ogImage?: { url?: string };
  faqs?: Faq[];
  subtopics?: HubSubtopic[];
  beforeYouArrive?: string;
  beforeYouArriveHeading?: string;
  decisionGuide?: { title: string; intro?: string; points?: string[]; recommendation?: string };
  mistakes?: { title: string; items?: { title: string; body: string; href?: string }[] };
  relatedHubs?: { title: string; href: string; excerpt?: string }[];
  toolCTA?: { label: string; href: string }[];
  faqHeading?: string;
  toolsHeading?: string;
  toolsIntro?: string;
};

export type ContentItem = {
  slug: string;
  kind: "article" | "hub" | "legal";
  frontmatter: ContentFrontmatter;
  body: string;
};

export type ContentLang = "en" | "zh";

const contentSources: Record<ContentLang, { directory: string; kind: ContentItem["kind"] }[]> = {
  en: [
    { directory: path.join(process.cwd(), "_posts"), kind: "article" as const },
    { directory: path.join(process.cwd(), "content", "hubs"), kind: "hub" as const },
    { directory: path.join(process.cwd(), "content", "legal"), kind: "legal" as const },
  ],
  // Chinese translations live in parallel directories (see docs/i18n-plan.md).
  // Missing directories are skipped, so untranslated content simply has no
  // /zh URL instead of falling back to English (avoids soft duplicates).
  zh: [
    { directory: path.join(process.cwd(), "_posts-zh"), kind: "article" as const },
    { directory: path.join(process.cwd(), "content-zh", "hubs"), kind: "hub" as const },
    { directory: path.join(process.cwd(), "content-zh", "legal"), kind: "legal" as const },
  ],
};

const contentCache: Partial<Record<ContentLang, ContentItem[]>> = {};

function readDirectory(absoluteDirectory: string, kind: ContentItem["kind"]): ContentItem[] {
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs.readdirSync(absoluteDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const source = fs.readFileSync(path.join(absoluteDirectory, file), "utf8");
      const parsed = matter(source);
      return {
        slug,
        kind,
        frontmatter: parsed.data as ContentFrontmatter,
        body: parsed.content.trim(),
      };
    })
    // Legacy content has no status. Explicit drafts and reviews stay out of
    // routes, search, related articles and the sitemap through this shared list.
    .filter((item) => !item.frontmatter.status || item.frontmatter.status === "published");
}

export function getAllContent(lang: ContentLang = "en"): ContentItem[] {
  contentCache[lang] ??= contentSources[lang].flatMap(({ directory, kind }) => readDirectory(directory, kind));
  return contentCache[lang];
}

export function getContentBySlug(slug: string, lang: ContentLang = "en"): ContentItem | undefined {
  return getAllContent(lang).find((item) => item.slug === slug);
}

export function getRelatedArticles(item: ContentItem, limit = 4, lang: ContentLang = "en"): ContentItem[] {
  return getAllContent(lang)
    .filter((candidate) => candidate.kind === "article" && candidate.slug !== item.slug)
    .sort((a, b) => Number(b.frontmatter.section === item.frontmatter.section) - Number(a.frontmatter.section === item.frontmatter.section))
    .slice(0, limit);
}

/**
 * Slug of this item's translation in the other language. Defaults to the
 * same slug; a translated file may point elsewhere via `translationKey`.
 */
export function translationSlug(item: ContentItem): string {
  return item.frontmatter.translationKey ?? item.slug;
}

export function absoluteUrl(value?: string, fallbackSlug?: string): string {
  if (value?.startsWith("http")) return value;
  const pathname = value || `/${fallbackSlug || ""}`;
  return new URL(pathname, "https://hiddenchinatravel.com").toString();
}
