import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { YunnanGuidePage } from "@/components/yunnan-guide-page";
import { getAllJourneys } from "@/lib/journeys";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  return localizedStaticMetadata(lang, "/china-destinations/yunnan", {
    title: "Yunnan Travel Guide 2026: First Trip Route",
    description: "Plan a first trip to Yunnan with realistic advice on Kunming, Dali, Shaxi and Lijiang, recommended timing, practical preparation and a private 6-day journey.",
    keywords: ["Yunnan travel guide", "Yunnan itinerary", "places to visit in Yunnan", "Dali Shaxi Lijiang", "Yunnan private tour"],
    openGraph: {
      type: "website",
      title: "Yunnan Travel Guide: Dali, Shaxi & Lijiang",
      description: "A practical first-trip guide to Yunnan, with local insight, realistic pacing and a private journey through Kunming, Dali, Shaxi and Lijiang.",
      url: "https://hiddenchinatravel.com/china-destinations/yunnan",
      images: [{ url: "https://hiddenchinatravel.com/home/hero.webp" }],
    },
  });
}

export default function YunnanPage() {
  const journey = getAllJourneys().find((item) => item.frontmatter.featured) ?? getAllJourneys()[0];
  if (!journey) notFound();
  return <YunnanGuidePage journey={journey} />;
}
