import type { MetadataRoute } from "next";
import { getAllContent, getContentBySlug, translationSlug } from "@/lib/content";
import { isZhLive, localeUrl } from "@/lib/i18n-seo";
import { getAllJourneys, getJourneyBySlug } from "@/lib/journeys";
import { getTravelJournals } from "@/lib/travel-journals";
import { getPhase1CountryEditorials } from "@/lib/visa-checker/country-pages";

const coreUpdated = new Date("2026-10-22");

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * loc stays the English URL (unchanged from the pre-i18n sitemap, byte for
 * byte). Chinese URLs appear only via xhtml:link alternates, and only for
 * pages whose translation is actually live (docs/i18n-plan.md §2/§6).
 */
function localizedEntry(
  path: string,
  zhAvailable: boolean,
  base: { lastModified?: Date | string; changeFrequency?: SitemapEntry["changeFrequency"]; priority?: number },
): SitemapEntry {
  const languages: Record<string, string> = { en: localeUrl("en", path) };
  if (zhAvailable) languages["zh-Hans"] = localeUrl("zh", path);
  languages["x-default"] = localeUrl("en", path);
  return { url: localeUrl("en", path), ...base, alternates: { languages } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    localizedEntry("/", isZhLive("/"), { lastModified: coreUpdated, changeFrequency: "weekly", priority: 1 }),
    localizedEntry("/about-us", isZhLive("/about-us"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.6 }),
    localizedEntry("/traveler-stories", isZhLive("/traveler-stories"), { lastModified: new Date("2026-10-26"), changeFrequency: "monthly", priority: 0.7 }),
    // Traveler stories are English-only (plan phase P4).
    ...getTravelJournals().map((journal) =>
      localizedEntry(`/traveler-stories/${journal.slug}`, false, {
        lastModified: new Date("2026-10-26"),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }),
    ),
    localizedEntry("/contact", isZhLive("/contact"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.7 }),
    localizedEntry("/china-destinations/yunnan", isZhLive("/china-destinations/yunnan"), { lastModified: coreUpdated, changeFrequency: "weekly", priority: 0.9 }),
    localizedEntry("/journeys", isZhLive("/journeys"), { lastModified: coreUpdated, changeFrequency: "weekly", priority: 0.9 }),
    localizedEntry("/survival-kit", isZhLive("/survival-kit"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/china-visa-checker", isZhLive("/china-visa-checker"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/china-currency-converter", isZhLive("/china-currency-converter"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.8 }),
    localizedEntry("/custom-china-tour", isZhLive("/custom-china-tour"), { lastModified: coreUpdated, changeFrequency: "monthly", priority: 0.9 }),
    // Country visa pages stay English-only (plan §5).
    ...getPhase1CountryEditorials().map((country) =>
      localizedEntry(`/china-visa-checker/${country.slug}`, false, {
        lastModified: country.lastReviewed,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }),
    ),
    ...getAllJourneys("en").map((journey) =>
      localizedEntry(
        `/journeys/${journey.slug}`,
        Boolean(getJourneyBySlug(journey.frontmatter.translationKey ?? journey.slug, "zh")),
        { lastModified: coreUpdated, changeFrequency: "monthly" as const, priority: 0.9 },
      ),
    ),
    ...getAllContent("en").map((item) =>
      localizedEntry(
        `/${item.slug}`,
        Boolean(getContentBySlug(translationSlug(item), "zh")),
        {
          lastModified: item.frontmatter.dateModified || item.frontmatter.date,
          changeFrequency: item.kind === "hub" ? "weekly" as const : "monthly" as const,
          priority: item.kind === "hub" ? 0.9 : item.kind === "legal" ? 0.3 : 0.7,
        },
      ),
    ),
  ];
}
