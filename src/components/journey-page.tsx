import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { MarkdownContent } from "@/components/markdown-content";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";

const whatsapp = "https://wa.me/8618880441791?text=Hi%20Joy%2C%20I%27m%20interested%20in%20the%206-day%20Kunming%E2%80%93Dali%E2%80%93Shaxi%E2%80%93Lijiang%20journey.%20My%20travel%20dates%20are%20____%20and%20there%20will%20be%20____%20travelers.";

function price(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function JourneyPage({ journey }: { journey: Journey }) {
  const { frontmatter } = journey;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: frontmatter.title,
    description: frontmatter.metaDescription,
    image: `https://hiddenchinatravel.com${frontmatter.coverImage}`,
    touristType: frontmatter.travelStyles,
    itinerary: frontmatter.route,
    provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" },
    offers: { "@type": "Offer", priceCurrency: frontmatter.currency, price: frontmatter.fromPrice, url: `https://hiddenchinatravel.com/journeys/${journey.slug}` },
  };

  return <main>
    <SiteHeader />
    <nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/journeys">Journeys</Link><span>›</span><span>{frontmatter.title}</span></nav>
    <header className="journey-hero">
      <Image src={frontmatter.coverImage} alt="Mountains and countryside along a Yunnan journey" fill priority unoptimized sizes="100vw" />
      <div className="journey-hero-shade" />
      <div className="journey-hero-copy shell"><p>A PRIVATE YUNNAN JOURNEY</p><h1>{frontmatter.title}</h1><span>{frontmatter.excerpt}</span><div className="journey-hero-actions"><Link className="button button-blue" href={whatsapp}>PLAN THIS JOURNEY</Link><Link className="button button-light" href="#itinerary">VIEW THE 6-DAY ITINERARY</Link></div><small>No pressure to book. Start with your dates, group size and preferred pace.</small></div>
    </header>

    <section className="journey-glance"><div className="shell">{[
      ["DURATION", frontmatter.duration], ["ROUTE", frontmatter.route], ["STYLE", frontmatter.journeyType], ["GUIDE PRICE", `From ¥${price(frontmatter.fromPrice)} ${frontmatter.priceBasis}`],
    ].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></section>

    <section className="journey-intro section"><div className="narrow"><h2>Remember how Yunnan felt, not just where you went.</h2><MarkdownContent>{journey.body}</MarkdownContent></div></section>

    <section className="journey-experiences section section-sand"><div className="shell"><div className="section-heading"><h2>Signature experiences</h2><p>A journey built around moments, local people and enough time to take them in.</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience) => <article key={experience.title}><div><Image src={experience.image} alt={experience.title} fill sizes="(max-width: 700px) 100vw, 25vw" unoptimized /></div><span>EXPERIENCE</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section>

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>YOUR 6 DAYS IN YUNNAN</p><h2>A rhythm of arrival, discovery and rest.</h2><span>This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary><p>{day.description}</p></details>)}</div></div></section>

    <section className="journey-mid-cta"><div className="shell"><div><p>MAKE THE ROUTE YOURS</p><h2>More time in Dali—or an extra night in Shaxi?</h2></div><div><Link href={whatsapp} className="button button-light">ASK JOY TO ADJUST THIS ROUTE</Link><span>Tell us what you would slow down, add or leave out.</span></div></div></section>

    <section className="journey-support section"><div className="shell journey-section-layout"><header><p>INDEPENDENT FREEDOM, LOCAL SUPPORT</p><h2>Your journey, with the difficult parts made easier.</h2></header><div className="journey-support-grid">{[
      ["01", "Private by design", "Travel with your own party, never a coach group of strangers."],
      ["02", "Local people", "Experienced drivers and English-speaking guides are arranged where they add real value."],
      ["03", "No shopping stops", "Your time goes to places, people and experiences—not commission-led detours."],
      ["04", "Clear responsibility", "A licensed local travel partner provides the final quote, contract and on-the-ground operation."],
    ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="journey-pricing section section-sand"><div className="shell"><div className="section-heading"><h2>Choose the travel style that fits you</h2><p>Three accommodation levels, with the same private and unhurried foundation.</p></div><div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">MOST POPULAR</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>¥{price(tier.price)}</b> <span>per person</span></div><p>{tier.description}</p><ul><li>{tier.accommodation}</li><li>Private transportation</li><li>Local experiences</li><li>Journey support</li></ul><small>IDEAL FOR</small><strong>{tier.idealFor}</strong></article>)}</div><p className="journey-price-note">These are guide prices. Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract.</p></div></section>

    <section className="journey-inclusions section"><div className="shell journey-inclusion-grid"><div><h2>What’s included</h2>{frontmatter.inclusions.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><h2>What’s not included</h2>{frontmatter.exclusions.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

    <section className="journey-faq section"><div className="narrow"><div className="section-heading"><h2>Frequently asked questions</h2></div>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Planning starts with a conversation.</h2><span>Send Joy your dates, group size and preferred travel pace. We’ll help you decide whether this journey is the right fit.</span><Link href={whatsapp} className="button button-light">PLAN THIS JOURNEY</Link></div></section>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
