import "server-only";

import { getAllContent } from "@/lib/content";
import { getAllJourneys } from "@/lib/journeys";
import type { SearchItem } from "@/lib/search-types";

export function getSearchIndex(): SearchItem[] {
  const pages: SearchItem[] = [
    { id: "home", title: "Hidden China Travel", href: "/", description: "Private journeys, local knowledge and practical travel guides for China.", type: "page", keywords: ["home", "China", "Yunnan", "journeys"] },
    { id: "about", title: "About Hidden China Travel", href: "/about-us", description: "Meet Joy Liu and learn about our personal approach to travel in China.", type: "page", keywords: ["Joy Liu", "about", "local travel"] },
  ];

  const content = getAllContent().map<SearchItem>((item) => ({
    id: item.slug,
    title: item.frontmatter.title,
    href: `/${item.slug}`,
    description: item.frontmatter.excerpt || item.frontmatter.description || item.frontmatter.metaDescription || "",
    type: item.kind,
    keywords: [item.frontmatter.section || "", ...(item.frontmatter.keywords || [])].filter(Boolean),
    image: item.frontmatter.coverImage,
  }));

  const journeys = getAllJourneys().map<SearchItem>((journey) => ({
    id: `journey-${journey.slug}`,
    title: journey.frontmatter.title,
    href: `/journeys/${journey.slug}`,
    description: journey.frontmatter.excerpt,
    type: "journey",
    keywords: [journey.frontmatter.route, ...journey.frontmatter.travelStyles],
    image: journey.frontmatter.coverImage,
  }));

  return [...pages, ...journeys, ...content];
}
