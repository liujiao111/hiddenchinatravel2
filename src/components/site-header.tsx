import { SiteHeaderClient, type HeaderJourney } from "@/components/site-header-client";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys, type Journey } from "@/lib/journeys";

function navSellingPoint(journey: Journey) {
  const excerpt = journey.frontmatter.excerpt?.trim() ?? "";
  return excerpt.length > 0 && excerpt.length <= 72 ? excerpt : journey.frontmatter.route;
}

function navPriceLabel(journey: Journey) {
  if (journey.frontmatter.fromPrice > 0) {
    return `From ${formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency)}`;
  }
  return "Tailored quote";
}

export function SiteHeader({ cta }: { cta?: { href: string; label: string; location?: string } } = {}) {
  const journeys: HeaderJourney[] = getAllJourneys()
    .filter((journey) => journey.frontmatter.navFeatured)
    .map((journey) => ({
      slug: journey.slug,
      title: journey.frontmatter.title,
      duration: journey.frontmatter.duration,
      image: journey.frontmatter.coverImage,
      sellingPoint: navSellingPoint(journey),
      priceLabel: navPriceLabel(journey),
    }));

  return <SiteHeaderClient journeys={journeys} cta={cta} />;
}
