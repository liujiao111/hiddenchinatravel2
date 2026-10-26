import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TravelJournalPage } from "@/components/travel-journal-page";
import { getTravelJournal, getTravelJournals } from "@/lib/travel-journals";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getTravelJournals().map((journal) => ({ slug: journal.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journal = getTravelJournal((await params).slug);
  if (!journal) return {};
  const path = `/traveler-stories/${journal.slug}`;
  const title = journal.title;
  return {
    title,
    description: journal.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Hidden China Travel`,
      description: journal.description,
      url: path,
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
  const journal = getTravelJournal((await params).slug);
  if (!journal) notFound();
  return <TravelJournalPage journal={journal} />;
}
