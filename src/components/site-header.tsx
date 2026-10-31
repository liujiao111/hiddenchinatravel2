import { getLocale, getTranslations } from "next-intl/server";
import { SiteHeaderClient, type HeaderJourney } from "@/components/site-header-client";
import { formatPriceLabel } from "@/lib/format-price";
import type { AppLocale, LocaleAlternate } from "@/lib/i18n-seo";
import { getAllJourneys, type Journey } from "@/lib/journeys";

function navSellingPoint(journey: Journey) {
  const excerpt = journey.frontmatter.excerpt?.trim() ?? "";
  return excerpt.length > 0 && excerpt.length <= 72 ? excerpt : journey.frontmatter.route;
}

export async function SiteHeader({ cta, conversion, alternate }: { cta?: { href: string; label: string; location?: string; mailHref?: string }; conversion?: boolean; alternate?: LocaleAlternate } = {}) {
  const lang = await getLocale() as AppLocale;
  const t = await getTranslations({ locale: lang, namespace: "header" });
  const journeys: HeaderJourney[] = getAllJourneys(lang)
    .filter((journey) => journey.frontmatter.navFeatured)
    .map((journey) => ({
      slug: journey.slug,
      title: journey.frontmatter.title,
      duration: journey.frontmatter.duration,
      image: journey.frontmatter.coverImage,
      sellingPoint: navSellingPoint(journey),
      priceLabel: journey.frontmatter.fromPrice > 0
        ? t("fromPrice", { price: formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency) })
        : t("tailoredQuote"),
    }));

  return <SiteHeaderClient journeys={journeys} cta={cta} conversion={conversion} alternate={alternate} />;
}
