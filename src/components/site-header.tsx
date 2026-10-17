import { SiteHeaderClient, type HeaderJourney } from "@/components/site-header-client";
import { getAllJourneys } from "@/lib/journeys";

export function SiteHeader() {
  const journeys: HeaderJourney[] = getAllJourneys()
    .filter((journey) => journey.frontmatter.navFeatured)
    .map((journey) => ({
      slug: journey.slug,
      title: journey.frontmatter.title,
      duration: journey.frontmatter.duration,
      image: journey.frontmatter.coverImage,
    }));

  return <SiteHeaderClient journeys={journeys} />;
}
