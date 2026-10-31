import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TravelJournalPage } from "@/components/travel-journal-page";
import { alternatesFor } from "@/lib/i18n-seo";
import { getTravelJournal, getTravelJournals } from "@/lib/travel-journals";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

// Traveler stories are English-only for now (i18n plan phase P4) — no /zh URLs.
export function generateStaticParams() {
  return getTravelJournals().map((journal) => ({ lang: "en", slug: journal.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journal = getTravelJournal(slug);
  if (!journal) return {};
  const path = `/traveler-stories/${journal.slug}`;
  const title = journal.title;
  return {
    title,
    description: journal.description,
    alternates: alternatesFor("en", path, ["en"]),
    openGraph: {
      title: `${title} | Hidden China Travel`,
      description: journal.description,
      url: alternatesFor("en", path, ["en"]).canonical,
      type: "article",
      images: [{ url: journal.heroImage, alt: journal.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hidden China Travel`,
      description: journal.description,
      images: [journal.heroImage],
    },
  };
}

export default async function JournalRoute({ params }: Props) {
  const { slug } = await params;
  const journal = getTravelJournal(slug);
  if (!journal) notFound();
  return <TravelJournalPage journal={journal} />;
}
