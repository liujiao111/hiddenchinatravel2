import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { YunnanGuidePage } from "@/components/yunnan-guide-page";
import { getAllJourneys } from "@/lib/journeys";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === "zh";
  return localizedStaticMetadata(lang, "/china-destinations/yunnan", {
    title: zh ? "云南旅游攻略 2026：第一次去路线怎么安排" : "Yunnan Travel Guide 2026: First Trip Route",
    description: zh ? "第一次云南旅行实用指南：昆明、大理、沙溪、丽江路线，建议天数、季节、交通准备与 6 天私家行程。" : "Plan a first trip to Yunnan with realistic advice on Kunming, Dali, Shaxi and Lijiang, recommended timing, practical preparation and a private 6-day journey.",
    keywords: zh ? ["云南旅游攻略", "云南行程", "云南旅游景点", "大理沙溪丽江", "云南私家团"] : ["Yunnan travel guide", "Yunnan itinerary", "places to visit in Yunnan", "Dali Shaxi Lijiang", "Yunnan private tour"],
    openGraph: {
      type: "website",
      title: zh ? "云南旅行指南：大理、沙溪与丽江" : "Yunnan Travel Guide: Dali, Shaxi & Lijiang",
      description: zh ? "第一次去云南的实用指南：本地经验、合理节奏，以及昆明、大理、沙溪、丽江私家路线。" : "A practical first-trip guide to Yunnan, with local insight, realistic pacing and a private journey through Kunming, Dali, Shaxi and Lijiang.",
      url: "https://hiddenchinatravel.com/china-destinations/yunnan",
      images: [{ url: "https://hiddenchinatravel.com/home/hero.webp" }],
    },
  });
}

export default async function YunnanPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  const journey = getAllJourneys(lang).find((item) => item.frontmatter.featured) ?? getAllJourneys(lang)[0];
  if (!journey) notFound();
  return <YunnanGuidePage journey={journey} />;
}
