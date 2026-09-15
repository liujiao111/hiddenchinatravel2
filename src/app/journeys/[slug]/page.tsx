import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyPage } from "@/components/journey-page";
import { getAllJourneys, getJourneyBySlug } from "@/lib/journeys";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllJourneys().map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journey = getJourneyBySlug((await params).slug);
  if (!journey) return {};
  const { frontmatter } = journey;
  const canonical = `https://hiddenchinatravel.com/journeys/${journey.slug}`;
  return {
    title: frontmatter.seoTitle,
    description: frontmatter.metaDescription,
    alternates: { canonical },
    openGraph: { title: frontmatter.seoTitle, description: frontmatter.metaDescription, url: canonical, type: "website", images: [{ url: frontmatter.coverImage }] },
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const journey = getJourneyBySlug((await params).slug);
  if (!journey) notFound();
  return <JourneyPage journey={journey} />;
}
