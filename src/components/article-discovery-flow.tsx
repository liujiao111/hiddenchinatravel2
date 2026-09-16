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
}: {
  related: ContentItem[];
  journey?: Journey;
  sourceTitle: string;
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
      <div className="shell">
        <header className="article-flow-heading">
          <h2>Start with Yunnan</h2>
          <p>Many travelers visit China.<br />Few experience it the way locals do.</p>
        </header>
        <div className="article-featured-journey">
          <JourneyCard journey={{
            title: "Dali, Shaxi & Lijiang",
            subtitle: "Your first journey through Yunnan.",
            href: `/journeys/${journey.slug}`,
            image: journey.frontmatter.coverImage,
            imageAlt: journey.frontmatter.title,
            duration: journey.frontmatter.duration,
            fromPrice: journeyPrice(journey),
            features: journeyFeatures,
          }} />
        </div>
        <div className="article-secondary-link">
          <span>Not ready for a journey yet?</span>
          <Link href="/china-destinations/yunnan">Explore our Yunnan travel guides →</Link>
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
