import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type JourneyExperience = { title: string; image: string; imageAlt?: string; description: string };
export type JourneyDay = { days: string; title: string; meta: string; description: string; meals?: string; image?: string; imageAlt?: string };
export type JourneyTier = { name: string; price: number; description: string; accommodation: string; idealFor: string; featured?: boolean };
export type JourneyFaq = { question: string; answer: string };
export type JourneyNote = { title: string; detail: string };
export type JourneyPracticalGroup = { label: string; items: JourneyFaq[] };
export type JourneyOverviewItem = { label: string; value: string };

export type JourneyFrontmatter = {
  title: string;
  shortTitle: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  duration: string;
  route: string;
  pace: string;
  journeyType: string;
  fromPrice: number;
  currency: string;
  priceBasis: string;
  coverImage: string;
  coverAlt?: string;
  featured?: boolean;
  status?: "draft" | "planned" | "published";
  /** Slug of the paired translation in the other language. */
  translationKey?: string;
  displayOrder?: number;
  navFeatured?: boolean;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSecondaryLabel?: string;
  heroDescription?: string;
  heroNote?: string;
  heroBounds?: string;
  overviewTitle?: string;
  overviewDescription?: string;
  overviewItems?: JourneyOverviewItem[];
  whoFor?: string;
  whenToGo?: string;
  heroIncludes?: string[];
  manifestoKicker?: string;
  manifestoLead?: string;
  manifestoClose?: string;
  fitKicker?: string;
  fitHeading?: string;
  goodFit?: string[];
  poorFit?: string[];
  itineraryKicker?: string;
  itineraryHeading?: string;
  itineraryIntro?: string;
  midCtaHeading?: string;
  pricingHeading?: string;
  pricingIntro?: string;
  priceExplanation?: string;
  travelStyles: string[];
  experiences: JourneyExperience[];
  itinerary: JourneyDay[];
  tiers: JourneyTier[];
  inclusions: string[];
  exclusions: string[];
  bookingNotes?: JourneyNote[];
  goodToKnow?: JourneyPracticalGroup[];
  faqs: JourneyFaq[];
};

export type Journey = { slug: string; frontmatter: JourneyFrontmatter; body: string };

export type JourneyLang = "en" | "zh";

const journeyCache: Partial<Record<JourneyLang, Journey[]>> = {};

export function getAllJourneys(lang: JourneyLang = "en"): Journey[] {
  if (journeyCache[lang] && process.env.NODE_ENV !== "development") return journeyCache[lang];
  // Chinese journeys live in content-zh/journeys (docs/i18n-plan.md). A
  // missing directory means "not translated yet" — no /zh journey URLs.
  const directory = lang === "zh"
    ? path.join(process.cwd(), "content-zh", "journeys")
    : path.join(process.cwd(), "content", "journeys");
  if (!fs.existsSync(directory)) return [];
  journeyCache[lang] = fs.readdirSync(directory).filter((file) => file.endsWith(".md")).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), "utf8"));
    return { slug: file.replace(/\.md$/, ""), frontmatter: parsed.data as JourneyFrontmatter, body: parsed.content.trim() };
  })
    .filter((journey) => journey.frontmatter.status === "published")
    .sort((a, b) => {
      const orderA = a.frontmatter.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.frontmatter.displayOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  return journeyCache[lang];
}

export function getJourneyBySlug(slug: string, lang: JourneyLang = "en") {
  return getAllJourneys(lang).find((journey) => journey.slug === slug);
}
