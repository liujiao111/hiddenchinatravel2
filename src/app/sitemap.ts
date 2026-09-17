import type { MetadataRoute } from "next";
import { absoluteUrl, getAllContent } from "@/lib/content";
import { getAllJourneys } from "@/lib/journeys";
import { getPhase1CountryEditorials } from "@/lib/visa-checker/country-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hiddenchinatravel.com", changeFrequency: "weekly", priority: 1 },
    { url: "https://hiddenchinatravel.com/about-us", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://hiddenchinatravel.com/contact", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://hiddenchinatravel.com/china-destinations/yunnan", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://hiddenchinatravel.com/journeys", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://hiddenchinatravel.com/survival-kit", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hiddenchinatravel.com/china-visa-checker", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://hiddenchinatravel.com/china-currency-converter", changeFrequency: "monthly", priority: 0.8 },
    ...getPhase1CountryEditorials().map((country) => ({
      url: `https://hiddenchinatravel.com/china-visa-checker/${country.slug}`,
      lastModified: country.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllJourneys().map((journey) => ({
      url: `https://hiddenchinatravel.com/journeys/${journey.slug}`,
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
