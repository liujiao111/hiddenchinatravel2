import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyPage } from "@/components/journey-page";
import { JourneyPageV2 } from "@/components/journey-page-v2";
import { routing } from "@/i18n/routing";
import { alternatesFor, robotsFor, type AppLocale } from "@/lib/i18n-seo";
import { getAllJourneys, getJourneyBySlug } from "@/lib/journeys";

type Props = { params: Promise<{ lang: AppLocale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Journeys only get a /zh URL once a translation exists in
  // content-zh/journeys (docs/i18n-plan.md §3).
  return routing.locales.flatMap((lang) =>
    getAllJourneys(lang).map((journey) => ({ lang, slug: journey.slug })),
  );
}

function journeyAlternates(lang: AppLocale, slug: string) {
  const journey = getJourneyBySlug(slug, lang);
  if (!journey) return undefined;
  const otherLang: AppLocale = lang === "en" ? "zh" : "en";
  const otherSlug = journey.frontmatter.translationKey ?? slug;
  const available: AppLocale[] = [lang];
  if (getJourneyBySlug(otherSlug, otherLang)) available.push(otherLang);
  const path = `/journeys/${slug}`;
  return { alternates: alternatesFor(lang, path, available), robots: robotsFor(lang, path) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const journey = getJourneyBySlug(slug, lang);
  if (!journey) return {};
  const { frontmatter } = journey;
  const canonical = alternatesFor(lang, `/journeys/${slug}`).canonical;
  const ogUrl = frontmatter.ogImage?.url || frontmatter.coverImage;
  const ogAlt = frontmatter.ogImage?.alt || frontmatter.coverAlt || frontmatter.title;
  return {
    title: frontmatter.seoTitle,
    description: frontmatter.metaDescription,
    keywords: frontmatter.keywords,
    ...journeyAlternates(lang, slug),
    openGraph: {
      title: frontmatter.seoTitle,
      description: frontmatter.metaDescription,
      url: canonical,
      type: "website",
      images: [
        {
          url: ogUrl,
          alt: ogAlt,
          width: frontmatter.ogImage?.width ?? 1600,
          height: frontmatter.ogImage?.height ?? 1045,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seoTitle,
      description: frontmatter.metaDescription,
      images: [{ url: ogUrl, alt: ogAlt }],
    },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const journey = getJourneyBySlug(slug, lang);
  if (!journey) notFound();
  const otherLang: AppLocale = lang === "en" ? "zh" : "en";
  const otherSlug = journey.frontmatter.translationKey ?? slug;
  const alternate = {
    [lang]: `/journeys/${journey.slug}`,
    [otherLang]: getJourneyBySlug(otherSlug, otherLang) ? `/journeys/${otherSlug}` : null,
  } as const;
  if (slug === "kunming-dali-lijiang-shangri-la-private-tour") {
    return <JourneyPageV2 journey={journey} alternate={alternate} />;
  }
  return <JourneyPage journey={journey} alternate={alternate} />;
}
