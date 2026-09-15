import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type JourneyExperience = { title: string; image: string; description: string };
export type JourneyDay = { days: string; title: string; meta: string; description: string };
export type JourneyTier = { name: string; price: number; description: string; accommodation: string; idealFor: string; featured?: boolean };
export type JourneyFaq = { question: string; answer: string };

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
  featured?: boolean;
  status?: string;
  travelStyles: string[];
  experiences: JourneyExperience[];
  itinerary: JourneyDay[];
  tiers: JourneyTier[];
  inclusions: string[];
  exclusions: string[];
  faqs: JourneyFaq[];
};

export type Journey = { slug: string; frontmatter: JourneyFrontmatter; body: string };

let journeyCache: Journey[] | undefined;

export function getAllJourneys(): Journey[] {
  if (journeyCache) return journeyCache;
  const directory = path.join(process.cwd(), "content", "journeys");
  if (!fs.existsSync(directory)) return [];
  journeyCache = fs.readdirSync(directory).filter((file) => file.endsWith(".md")).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), "utf8"));
    return { slug: file.replace(/\.md$/, ""), frontmatter: parsed.data as JourneyFrontmatter, body: parsed.content.trim() };
  }).filter((journey) => journey.frontmatter.status !== "draft");
  return journeyCache;
}

export function getJourneyBySlug(slug: string) {
  return getAllJourneys().find((journey) => journey.slug === slug);
}
