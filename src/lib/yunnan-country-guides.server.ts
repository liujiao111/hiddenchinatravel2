import "server-only";

import { getContentBySlug } from "@/lib/content";
import { yunnanCountryGuides } from "@/lib/yunnan-country-guides";

export function getPublishedYunnanCountryGuides() {
  // Use the same publication gate as article routes, search and the sitemap.
  return yunnanCountryGuides.filter((guide) => getContentBySlug(guide.slug));
}
