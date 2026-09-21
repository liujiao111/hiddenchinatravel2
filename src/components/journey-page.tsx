import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { ContentFooter } from "@/components/content-footer";
import { GuideCard } from "@/components/guide-card";
import { SiteHeader } from "@/components/site-header";
import { formatPriceLabel } from "@/lib/format-price";

const whatsapp = "https://wa.me/8618880441791?text=Hi%20Joy%2C%20I%27m%20interested%20in%20the%206-day%20Kunming%E2%80%93Dali%E2%80%93Shaxi%E2%80%93Lijiang%20journey.%20My%20travel%20dates%20are%20____%20and%20there%20will%20be%20____%20travelers.";
const goodFit = ["Experiences over checklists", "Local culture and daily life", "A comfortable, unhurried pace", "Stories worth bringing home"];
const poorFit = ["The maximum number of sights", "A fast-paced coach tour", "The lowest-cost package", "A rigid, minute-by-minute schedule"];
const supportPoints = [
  ["01", "Private by design", "Travel with your own party, never a coach group of strangers."],
  ["02", "Local people", "Experienced drivers and English-speaking guides are arranged where they add real value."],
  ["03", "No shopping stops", "Your time goes to places, people and experiences—not commission-led detours."],
  ["04", "Clear responsibility", "A licensed local travel partner provides the final quote, contract and on-the-ground operation."],
];
const journeyGuides = [
  {
    title: "Yunnan Travel Guide",
    excerpt: "Understand how Kunming, Dali, Shaxi and Lijiang fit together before choosing your pace.",
    href: "/china-destinations/yunnan",
    image: "/home/hero.webp",
    readTime: "START HERE",
  },
  {
    title: "Dali Travel Guide",
    excerpt: "Plan your time around Erhai, the old town, Bai villages and the parts of Dali worth slowing down for.",
    href: "/dali-travel-guide",
    image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp",
    readTime: "DESTINATION GUIDE",
  },
  {
    title: "Dali Hidden Gems & Shaxi",
    excerpt: "Learn why Shaxi deserves an overnight stay and what else lies beyond Dali's busiest streets.",
    href: "/dali-hidden-gems-off-the-beaten-path",
    image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-theater-courtyard.webp",
    readTime: "LOCAL GUIDE",
  },
];

export function JourneyPage({ journey }: { journey: Journey }) {
  const { frontmatter } = journey;
  const isSixDayYunnanJourney = journey.slug === "kunming-dali-shaxi-lijiang-6-days";
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
    <header className="journey-hero">
      <Image src={frontmatter.coverImage} alt="Mountains and countryside along a Yunnan journey" fill priority unoptimized sizes="100vw" />
      <div className="journey-hero-shade" />
      <nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/journeys">Journeys</Link><span>›</span><span>{frontmatter.title}</span></nav>
      <div className="journey-hero-copy shell"><div><p>A PRIVATE YUNNAN JOURNEY</p><h1>{frontmatter.title}</h1><span>{frontmatter.excerpt}</span><div className="journey-hero-actions"><Link className="button journey-primary-action" href={whatsapp}>PLAN THIS JOURNEY</Link><Link className="journey-text-action" href="#itinerary">EXPLORE THE 6-DAY ITINERARY <b>↓</b></Link></div><small>Start with your dates and preferred pace. No pressure to book.</small></div></div>
    </header>

    <section className="journey-glance"><div className="shell">{[
      ["DURATION", frontmatter.duration], ["ROUTE", frontmatter.route], ["STYLE", frontmatter.journeyType], ["GUIDE PRICE", `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}`],
    ].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></section>

    <nav className="journey-anchor-nav" aria-label="On this journey"><div className="shell"><div><Link href="#story">The feeling</Link><Link href="#experiences">Experiences</Link><Link href="#itinerary">Itinerary</Link><Link href="#pricing">Travel styles</Link><Link href="#details">What’s included</Link></div><Link href={whatsapp}>PLAN THIS JOURNEY</Link></div></nav>

    <section className="journey-manifesto" id="story"><div className="shell journey-manifesto-grid"><figure className="journey-manifesto-image one"><Image src="/assets/blog/dali-travel-guide/cangshan-village-fields.webp" alt="Fields and mountains near Dali" fill sizes="(max-width: 700px) 76vw, 25vw" unoptimized /></figure><div className="journey-manifesto-copy"><span>OUR WAY OF TRAVELLING</span><h2><span>Remember</span> <em>how Yunnan felt,</em> <span>not just where you went.</span></h2><i aria-hidden="true" /><p>A quiet evening in an old Tea Horse Road town. A conversation inside a traditional tie-dye workshop. A slow breakfast overlooking Erhai Lake.</p><strong>The best memories are rarely made in a hurry.</strong></div><figure className="journey-manifesto-image two"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A quiet riverside scene in Shaxi" fill sizes="(max-width: 700px) 45vw, 18vw" unoptimized /></figure></div></section>

    <section className="journey-fit"><div className="shell"><header><span>IS THIS YOUR KIND OF JOURNEY?</span><h2>For travelers who would rather go deeper than go faster.</h2></header><div className="journey-fit-columns"><div><h3>You’ll probably love it if you value…</h3>{goodFit.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><h3>It may not be for you if you want…</h3>{poorFit.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></div></section>

    <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="journey-editorial-heading"><span>THE MOMENTS THAT STAY WITH YOU</span><h2>Signature experiences</h2><p>Not additions made to fill an itinerary—moments chosen to give you more time with a place.</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={experience.image} alt={experience.title} fill sizes={index === 0 || index === 3 ? "(max-width: 700px) 100vw, 58vw" : "(max-width: 700px) 100vw, 42vw"} unoptimized /></div><span>0{index + 1} · EXPERIENCE</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section>

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>YOUR 6 DAYS IN YUNNAN</p><h2>A rhythm of arrival, discovery and rest.</h2><span>This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => {
      const isShaxi = isSixDayYunnanJourney && day.title.toLowerCase().includes("shaxi");
      return <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary><p>{day.description}</p>{isShaxi ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, padding: "0 36px 32px 94px" }}><figure style={{ position: "relative", aspectRatio: "3 / 4", margin: 0, overflow: "hidden" }}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="Stone-paved lane between traditional buildings in Shaxi" fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized style={{ objectFit: "cover" }} /></figure><figure style={{ position: "relative", aspectRatio: "3 / 4", margin: 0, overflow: "hidden" }}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A shepherd and goats beside the river outside Shaxi" fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized style={{ objectFit: "cover" }} /></figure></div> : null}</details>;
    })}</div></div></section>

    <section className="journey-mid-cta"><div className="shell"><div><p>MAKE THE ROUTE YOURS</p><h2>More time in Dali—or an extra night in Shaxi?</h2></div><div><Link href={whatsapp} className="button button-light">ASK JOY TO ADJUST THIS ROUTE</Link><span>Tell us what you would slow down, add or leave out.</span></div></div></section>

    <section className="journey-support section"><div className="shell journey-section-layout"><header><p>PRIVATE TRAVEL, LOCAL SUPPORT</p><h2>Your journey, with the difficult parts made easier.</h2><span>Your route remains personal and flexible, while trusted local people handle the logistical details behind it.</span></header><div className="journey-support-grid">{supportPoints.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized /></div><div className="journey-host-copy"><span>YOUR LOCAL CONNECTION</span><h2>A Yunnan journey shaped by someone who calls it home.</h2><blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote><p>Joy Liu was born and raised in Yunnan. She helps you shape the route around what matters to you, then connects you with licensed local partners who arrange and operate the journey.</p><Link href="/about-us">MEET JOY →</Link></div></section>

    <section className="journey-pricing section section-sand" id="pricing"><div className="shell"><div className="journey-editorial-heading"><span>PRICING & TRAVEL STYLES</span><h2>Choose the comfort level that fits you</h2><p>Three accommodation levels, with the same private and unhurried foundation.</p></div><div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">MOST POPULAR</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>per person</span></div><p>{tier.description}</p><ul><li>{tier.accommodation}</li><li>Private transportation</li><li>Local experiences</li><li>Journey support</li></ul><small>IDEAL FOR</small><strong>{tier.idealFor}</strong></article>)}</div><p className="journey-price-note">Prices are shown in USD and are intended as a guide. Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract.</p></div></section>

    <section className="journey-inclusions section" id="details"><div className="shell journey-inclusion-grid"><div><span className="journey-detail-label">THE DETAILS</span><h2>What’s included</h2>{frontmatter.inclusions.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><span className="journey-detail-label">GOOD TO KNOW</span><h2>What’s not included</h2>{frontmatter.exclusions.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

    <section className="journey-reading section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>PREPARE FOR THE JOURNEY</span><h2>Read the route before you travel it.</h2><p>Use these guides to understand the places, choose your pace and arrive with more useful context.</p></div><div className="journey-reading-grid">{journeyGuides.map((guide) => <GuideCard key={guide.href} guide={guide} />)}</div></div></section>

    <section className="journey-faq section"><div className="narrow"><div className="section-heading"><h2>Frequently asked questions</h2></div>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Planning starts with a conversation.</h2><span>Send Joy your dates, group size and preferred travel pace. We’ll help you decide whether this journey is the right fit.</span><Link href={whatsapp} className="button button-light">PLAN THIS JOURNEY</Link></div></section>
    <Link href={whatsapp} className="journey-mobile-cta">PLAN THIS JOURNEY <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
