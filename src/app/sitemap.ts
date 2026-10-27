import type { MetadataRoute } from "next";
import { absoluteUrl, getAllContent } from "@/lib/content";
import { getAllJourneys } from "@/lib/journeys";
import { getTravelJournals } from "@/lib/travel-journals";
import { getPhase1CountryEditorials } from "@/lib/visa-checker/country-pages";

const coreUpdated = new Date("2026-10-22");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hiddenchinatravel.com/", lastModified: coreUpdated, changeFrequency: "weekly", priority: 1 },
    { url: "https://hiddenchinatravel.com/about-us", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://hiddenchinatravel.com/traveler-stories", lastModified: new Date("2026-10-26"), changeFrequency: "monthly", priority: 0.7 },
    ...getTravelJournals().map((journal) => ({
      url: `https://hiddenchinatravel.com/traveler-stories/${journal.slug}`,
      lastModified: new Date("2026-10-26"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: "https://hiddenchinatravel.com/contact", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://hiddenchinatravel.com/china-destinations/yunnan", lastModified: coreUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://hiddenchinatravel.com/journeys", lastModified: coreUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://hiddenchinatravel.com/survival-kit", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hiddenchinatravel.com/china-visa-checker", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hiddenchinatravel.com/china-currency-converter", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hiddenchinatravel.com/custom-china-tour", lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.9 },
    ...getPhase1CountryEditorials().map((country) => ({
      url: `https://hiddenchinatravel.com/china-visa-checker/${country.slug}`,
      lastModified: country.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllJourneys().map((journey) => ({
      url: `https://hiddenchinatravel.com/journeys/${journey.slug}`,
      lastModified: coreUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...getAllContent().map((item) => ({
      url: absoluteUrl(item.frontmatter.canonical, item.slug),
      lastModified: item.frontmatter.dateModified || item.frontmatter.date,
      changeFrequency: item.kind === "hub" ? "weekly" as const : "monthly" as const,
      priority: item.kind === "hub" ? 0.9 : item.kind === "legal" ? 0.3 : 0.7,
    })),
  ];
}

