import { CustomJourneyLink } from "@/components/custom-journey-link";
import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import type { Journey } from "@/lib/journeys";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import { siteConfig } from "@/lib/site-config";

const journeyFeatures = ["Private journey", "No shopping stops", "Local experiences", "Flexible pace"];

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} MIN READ`;
}

function journeyPrice(journey: Journey) {
  const value = new Intl.NumberFormat("en-US").format(journey.frontmatter.fromPrice);
  const currency = journey.frontmatter.currency === "USD" ? "US$" : journey.frontmatter.currency === "CNY" ? "¥" : `${journey.frontmatter.currency} `;
  return `From ${currency}${value} ${journey.frontmatter.priceBasis}`;
}

export function ArticleDiscoveryFlow({
  related,
  journey,
  sourceTitle,
  sourceSection,
}: {
  related: ContentItem[];
  journey?: Journey;
  sourceTitle: string;
  sourceSection?: string;
}) {
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hi Joy, I was reading "${sourceTitle}" and would like some help planning my first trip to China.`)}`;

  return <>
    <section className="article-discovery article-explore">
      <div className="shell">
        <header className="article-flow-heading">
          <h2>Continue Exploring China</h2>
          <p>Practical guides to help you prepare for your first trip to China.</p>
        </header>
        <div className="article-guide-grid">
          {related.map((item) => <GuideCard key={item.slug} guide={{
            title: item.frontmatter.title,
            excerpt: item.frontmatter.excerpt,
            href: `/${item.slug}`,
            image: item.frontmatter.coverImage || "/home/hero.webp",
            imageAlt: item.frontmatter.title,
            readTime: readingTime(item.body),
          }} />)}
        </div>
        <div className="article-secondary-link">
          <span>Preparing for your first trip?</span>
          <Link href="/china-travel-essentials">View the complete China Survival Kit →</Link>
        </div>
      </div>
    </section>

    {journey ? <section className="article-discovery article-yunnan">
      <div className="shell article-yunnan-layout">
        <div className="article-yunnan-copy">
          <span>SEE YUNNAN AS A JOURNEY</span>
          <h2>{sourceSection === "China Itinerary Planning" ? "See how a Yunnan route comes together." : "With the practical questions answered, what could your journey look like?"}</h2>
          <p>Follow a private route through {journey.frontmatter.route.replaceAll(" → ", ", ")}. See the day-by-day plan, travel pace and what’s arranged before deciding whether it fits you.</p>
          <Link className="button" data-cta-location="article_yunnan" href={`/journeys/${journey.slug}`}>SEE THE DAY-BY-DAY JOURNEY →</Link>
          <CustomJourneyLink prompt="A different route or pace in mind?" location="article_custom_alternative" />
          <Link className="article-yunnan-guide-link" href="/china-destinations/yunnan">Explore Yunnan travel guides →</Link>
        </div>
        <div className="article-featured-journey">
          <JourneyCard journey={{
            title: journey.frontmatter.title,
            subtitle: "An unhurried Yunnan route shaped around your dates and group.",
            href: `/journeys/${journey.slug}`,
            image: journey.frontmatter.coverImage,
            imageAlt: journey.frontmatter.title,
            duration: journey.frontmatter.duration,
            fromPrice: journey.frontmatter.fromPrice > 0 ? journeyPrice(journey) : "Tailored quote for your dates",
            features: journeyFeatures,
            ctaLabel: "See the day-by-day journey →",
            trackingLocation: "article_yunnan",
          }} />
        </div>
      </div>
    </section> : null}

    <section className="talk-with-joy">
      <Image src="/home/local-support.webp" alt="Local support for a journey through Yunnan" fill unoptimized sizes="100vw" />
      <div className="talk-with-joy-shade" />
      <div className="shell talk-with-joy-copy">
        <h2>Not Sure Where to Start?</h2>
        <p>Whether you&apos;re wondering about visas, payments, Yunnan itineraries, or your first trip to China, you&apos;re welcome to ask.</p>
        <p>You&apos;ll be speaking directly with Joy Liu.</p>
        <strong>Born in Yunnan. Shaped by experiences abroad.</strong>
        <Link className="button" href={whatsapp}>Chat with Joy on WhatsApp</Link>
        <small>Usually replies within 24 hours.<br />No obligation. No pressure.</small>
      </div>
    </section>
  </>;
}
