import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TravelJournalPage } from "@/components/travel-journal-page";
import { alternatesFor, type AppLocale } from "@/lib/i18n-seo";
import { getTravelJournal, getTravelJournals } from "@/lib/travel-journals";

type Props = { params: Promise<{ lang: AppLocale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return (["en", "zh"] as const).flatMap((lang) =>
    getTravelJournals(lang).map((journal) => ({ lang, slug: journal.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const journal = getTravelJournal(slug, lang);
  if (!journal) return {};
  const path = `/traveler-stories/${journal.slug}`;
  const title = journal.title;
  const alternates = alternatesFor(lang, path, ["en", "zh"]);
  return {
    title,
    description: journal.description,
    alternates,
    openGraph: {
      title: `${title} | Hidden China Travel`,
      description: journal.description,
      url: alternates.canonical,
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
  const { lang, slug } = await params;
  const journal = getTravelJournal(slug, lang);
  if (!journal) notFound();
  return <TravelJournalPage journal={journal} />;
}
