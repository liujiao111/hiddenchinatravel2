import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys } from "@/lib/journeys";
import { getHomeTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Yunnan Private Tours & China Travel Guides | Hidden China Travel",
  description: "Discover private Yunnan journeys, practical China travel guides, local support, and personalized help for first-time visitors to China.",
};

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20first%20journey%20through%20Yunnan";
const heroTrust = ["Private journeys", "No shopping stops", "Licensed local operator", "Free 1-to-1 trip planning"];
const reasons = [
  ["01", "We make China easier", "First-time visitors often worry about payments, internet, transport and language. We help remove the guesswork before you arrive, so you can focus on the journey."],
  ["02", "Local knowledge from both sides", "Raised in Yunnan. Lived abroad. We know China, and we understand what foreign travelers actually need."],
  ["03", "No shopping stops", "We never include commission-based shopping detours. Journeys stay focused on places, people and experiences."],
  ["04", "Private travel only", "No large groups. No fixed schedules. Travel with your own party, at your own pace."],
];
const essentials = [
  { title: "How to Pay in China", detail: "Alipay, WeChat Pay, foreign cards and a sensible backup.", href: "/digital-survival-china-payment-guide" },
  { title: "Internet & eSIM Guide", detail: "What works for Google, WhatsApp and everyday data.", href: "/digital-survival-china-internet-guide" },
  { title: "China Visa-Free Guide", detail: "Check visa-free and transit options before you book.", href: "/china-visa-free-countries-2026" },
  { title: "Didi for Foreign Visitors", detail: "Set up ride-hailing, choose a pickup point and pay.", href: "/how-to-use-didi-china-foreigners" },
  { title: "Hotels in China", detail: "Choose suitable stays and prepare for passport registration.", href: "/hotels-in-china-for-foreigners" },
];
const planChecks = ["Your dates", "Number of travelers", "Interests", "Budget"];

function routeStops(route: string) {
  return route.replace(/\s*→\s*/g, " • ");
}

export default function Home() {
  const journeys = getAllJourneys();
  const stories = getHomeTestimonials();
  const featuredJourney = journeys.find((journey) => journey.frontmatter.featured && journey.frontmatter.fromPrice > 0)
    ?? journeys.find((journey) => journey.frontmatter.fromPrice > 0);

  return <main><SiteHeader />
    <section className="hero">
      <Image src="/home/hero.webp" alt="Snow-capped mountains in Yunnan" fill preload unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="hero-kicker">PRIVATE JOURNEYS THROUGH YUNNAN</p>
        <h1>Discover China from Yunnan at Your Pace</h1>
        <p>Explore Dali, Lijiang, Shaxi, Lugu Lake and Shangri-La through a private journey designed around your dates, interests and preferred pace.</p>
        <p className="hero-brand">Born in Yunnan. Shaped by experiences abroad.</p>
        <div className="hero-actions">
          <Link href="/custom-china-tour" data-cta-location="home_hero_custom" className="button button-blue">PLAN MY YUNNAN TRIP</Link>
          <Link href="/journeys" className="button button-light">EXPLORE JOURNEYS</Link>
        </div>
        <ul className="hero-trust">{heroTrust.map((item) => <li key={item}>{item}</li>)}</ul>
        <small>Share your dates and travel ideas. Joy will reply personally within 24 hours.</small>
      </div>
    </section>

    <section className="section why" id="why-us">
      <div className="shell">
        <div className="section-heading light">
          <h2>Why travelers choose Hidden China Travel</h2>
        </div>
        <div className="reason-grid">{reasons.map(([number, title, text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="section section-sand home-journeys" id="journeys">
      <div className="shell">
        <div className="section-heading">
          <h2>Featured private journeys</h2>
          <p>Start with a proven Yunnan route, or ask Joy to shape one around your dates.</p>
        </div>
        <div className="journeys-card-grid">
          {featuredJourney ? <JourneyCard priority journey={{
            title: "Classic Yunnan",
            subtitle: featuredJourney.frontmatter.excerpt,
            href: `/journeys/${featuredJourney.slug}`,
            image: featuredJourney.frontmatter.coverImage,
            imageAlt: featuredJourney.frontmatter.title,
            destination: routeStops(featuredJourney.frontmatter.route),
            duration: featuredJourney.frontmatter.duration,
            fromPrice: `From ${formatPriceLabel(featuredJourney.frontmatter.fromPrice, featuredJourney.frontmatter.currency)} per person`,
            features: ["Private vehicle", "Local guide", "Flexible pace"],
            ctaLabel: "View journey →",
            trackingLocation: "home_featured_classic",
          }} /> : null}
          <JourneyCard journey={{
            title: "Tailor-Made Journey",
            subtitle: "Not sure yet? Tell us your dates and interests. We'll create a custom proposal.",
            href: "/custom-china-tour",
            image: "/home/local-support.webp",
            imageAlt: "A wooden boat on a highland lake in Yunnan",
            destination: "Designed around you",
            features: ["Your dates", "Your interests", "Written proposal"],
            ctaLabel: "Design my trip →",
            trackingLocation: "home_featured_custom",
          }} />
        </div>
      </div>
    </section>

    <Testimonials items={stories} heading="What travelers say" intro="A few notes from guests who explored Yunnan with Joy and our local partners." />

    <section className="about-feature reverse home-founder" id="joy">
      <div className="about-feature-image">
        <Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" />
      </div>
      <div className="about-feature-copy">
        <h2>Meet Joy</h2>
        <h3 className="feature-name">Born in Yunnan. Shaped by experiences abroad.</h3>
        <p>I grew up in Yunnan and later lived in Japan and the Philippines.</p>
        <p>Being a foreigner myself taught me how intimidating China can feel before arrival.</p>
        <p>Hidden China Travel exists to make that first journey easier, smoother and more personal.</p>
        <Link href="/about-us">Read our story →</Link>
      </div>
    </section>

    <section className="section home-preparation" id="guides">
      <div className="shell">
        <header className="home-preparation-heading">
          <h2>China travel essentials</h2>
          <p>Practical guides for the details that are easier to settle before you fly — payments, data, visas, rides and hotels.</p>
          <Link className="section-heading-link" href="/china-destinations/yunnan">Open the Yunnan travel guide →</Link>
        </header>
        <div className="utility-grid">{essentials.map((item, index) => <Link href={item.href} key={item.title} className="utility-card"><i>0{index + 1}</i><h3>{item.title}</h3><p>{item.detail}</p><span>READ THE GUIDE →</span></Link>)}</div>
        <Link href="/survival-kit" className="button button-green home-preparation-cta">OPEN SURVIVAL KIT →</Link>
      </div>
    </section>

    <section className="cta-band final-cta" id="plan">
      <Image src="/home/plan-journey.webp" alt="Turquoise lake and snow mountains in Yunnan" fill unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div>
        <h2>Ready to explore Yunnan?</h2>
        <p>Tell us a few details and receive a personalized itinerary within 24 hours.</p>
        <ul className="final-cta-checks">{planChecks.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="hero-actions">
          <Link href="/custom-china-tour#plan" data-cta-location="home_final_custom" className="button button-blue">PLAN MY TRIP</Link>
          <Link href={whatsapp} data-cta-location="home_final_whatsapp" className="button button-light">WHATSAPP JOY</Link>
        </div>
      </div>
    </section>
    <ContentFooter />
  </main>;
}
