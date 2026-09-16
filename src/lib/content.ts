import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Faq = { question: string; answer: string };
export type HubArticle = { title: string; href: string; excerpt: string; badge?: string; status?: string };
export type HubSubtopic = { id: string; name: string; description?: string; articles?: HubArticle[] };

export type ContentFrontmatter = {
  type?: "hub" | "legal";
  title: string;
  seoTitle?: string;
  excerpt?: string;
  metaDescription?: string;
  description?: string;
  heroAnswer?: string;
  eyebrow?: string;
  coverImage?: string;
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

const contentSources = [
  { directory: path.join(process.cwd(), "_posts"), kind: "article" as const },
  { directory: path.join(process.cwd(), "content", "hubs"), kind: "hub" as const },
  { directory: path.join(process.cwd(), "content", "legal"), kind: "legal" as const },
];

let contentCache: ContentItem[] | undefined;

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
    });
}

export function getAllContent(): ContentItem[] {
  contentCache ??= contentSources.flatMap(({ directory, kind }) => readDirectory(directory, kind));
  return contentCache;
}

export function getContentBySlug(slug: string): ContentItem | undefined {
  return getAllContent().find((item) => item.slug === slug);
}

export function getRelatedArticles(item: ContentItem, limit = 4): ContentItem[] {
  return getAllContent()
    .filter((candidate) => candidate.kind === "article" && candidate.slug !== item.slug)
    .sort((a, b) => Number(b.frontmatter.section === item.frontmatter.section) - Number(a.frontmatter.section === item.frontmatter.section))
    .slice(0, limit);
}

export function absoluteUrl(value?: string, fallbackSlug?: string): string {
  if (value?.startsWith("http")) return value;
  const pathname = value || `/${fallbackSlug || ""}`;
  return new URL(pathname, "https://hiddenchinatravel.com").toString();
}
