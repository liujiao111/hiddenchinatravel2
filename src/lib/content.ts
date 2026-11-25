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
  heroImage?: string;
  heroAlt?: string;
  canonical?: string;
  date?: string;
  dateModified?: string;
  lastUpdated?: string;
  section?: string;
  keywords?: string[];
  /** Editorial product recommendations: explicit slugs take precedence. */
  relatedExperiences?: string[];
  experienceDestination?: string;
  experienceThemes?: string[];
  primaryService?: "experience" | "private_tours" | "private_driver";
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

// Transport articles can live under the broader "Itinerary Planning" section.
// Detect them by route slug as well as explicit transport sections, so a road
// transfer guide is not grouped with unrelated trip-planning content.
const yunnanPlace = "(?:kunming|dali|shaxi|lijiang|shangri-la|tiger-leaping-gorge|lugu-lake)";
const yunnanTransferSlug = new RegExp(`^${yunnanPlace}-to-${yunnanPlace}(?:-|$)`);

export function isTransportArticle(item: ContentItem): boolean {
  const section = (item.frontmatter.section || "").toLowerCase();
  return item.kind === "article" && (
    section.includes("transport") ||
    section.includes("交通") ||
    yunnanTransferSlug.test(item.slug)
  );
}

const relatedStopWords = new Set(["to", "from", "the", "in", "for", "a", "and", "how", "use", "guide", "china", "chinese", "foreigners", "travel", "2026", "2027"]);

function relatedTerms(item: ContentItem): Set<string> {
  return new Set(item.slug.split("-").filter((term) => term.length > 2 && !relatedStopWords.has(term)));
}

export function getRelatedArticles(item: ContentItem, limit = 4, lang: ContentLang = "en"): ContentItem[] {
  const transport = isTransportArticle(item);
  const sourceTerms = relatedTerms(item);
  const sameSection = item.frontmatter.section;
  const all = getAllContent(lang).filter((candidate) => candidate.kind === "article" && candidate.slug !== item.slug);
  // For transport articles, never fill vacant slots with unrelated visa,
  // payment, hotel or general itinerary articles.
  const candidates = transport ? all.filter(isTransportArticle) : all;

  const score = (candidate: ContentItem) => {
    const commonTerms = [...relatedTerms(candidate)].filter((term) => sourceTerms.has(term)).length;
    const bothYunnanTransfers = transport && yunnanTransferSlug.test(item.slug) && yunnanTransferSlug.test(candidate.slug);
    return commonTerms * 12 + (candidate.frontmatter.section === sameSection ? 16 : 0) + (bothYunnanTransfers ? 32 : 0);
  };

  return candidates
    .sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug))
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
