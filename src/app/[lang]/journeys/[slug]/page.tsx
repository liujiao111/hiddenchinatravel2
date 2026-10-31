import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyPage } from "@/components/journey-page";
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
  return {
    title: frontmatter.seoTitle,
    description: frontmatter.metaDescription,
    ...journeyAlternates(lang, slug),
    openGraph: { title: frontmatter.seoTitle, description: frontmatter.metaDescription, url: canonical, type: "website", images: [{ url: frontmatter.coverImage }] },
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
  return <JourneyPage journey={journey} alternate={alternate} />;
}
