import type { MetadataRoute } from "next";
import { absoluteUrl, getAllContent } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hiddenchinatravel.com", changeFrequency: "weekly", priority: 1 },
    { url: "https://hiddenchinatravel.com/about-us", changeFrequency: "monthly", priority: 0.6 },
    ...getAllContent().map((item) => ({
      url: absoluteUrl(item.frontmatter.canonical, item.slug),
      lastModified: item.frontmatter.dateModified || item.frontmatter.date,
      changeFrequency: item.kind === "hub" ? "weekly" as const : "monthly" as const,
      priority: item.kind === "hub" ? 0.9 : 0.7,
    })),
  ];
}
