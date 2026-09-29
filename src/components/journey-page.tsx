import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { ContentFooter } from "@/components/content-footer";
import { GuideCard } from "@/components/guide-card";
import { SiteHeader } from "@/components/site-header";
import { formatPriceLabel } from "@/lib/format-price";
import { HuataiServiceProof } from "@/components/huatai-service-proof";

const goodFit = ["Experiences over checklists", "Local culture and daily life", "A comfortable, unhurried pace", "Stories worth bringing home"];
const poorFit = ["The maximum number of sights", "A fast-paced coach tour", "The lowest-cost package", "A rigid, minute-by-minute schedule"];
const journeyGuides = [
  {
    title: "Yunnan Travel Guide",
    excerpt: "Understand Yunnan’s landscapes, seasons and travel distances before choosing your pace.",
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
  const isDaliLijiangLuguLakeJourney = journey.slug === "dali-lijiang-lugu-lake-private-tour";
  const routePhotos = [
    ["/assets/resources/大理-崇圣寺三塔-271.jpg", "Three Pagodas near Dali"],
    ["/assets/resources/大理-洱海-215.jpg", "Erhai Lake near Dali"],
    ["/assets/resources/丽江-丽江古城-248.jpg", "Lijiang Old Town"],
    ["/assets/resources/丽江-蓝月谷-316.jpg", "Blue Moon Valley below Jade Dragon Snow Mountain"],
    ["/assets/resources/丽江-泸沽湖-419.jpg", "Lugu Lake and its shoreline"],
    ["/assets/resources/丽江-泸沽湖-307.jpg", "Morning light over Lugu Lake"],
  ];
  const whatsapp = `https://wa.me/8618880441791?text=${encodeURIComponent(isDaliLijiangLuguLakeJourney ? `Hi Joy, I’m interested in the ${frontmatter.title} journey. Can we discuss my travel dates and group size?` : `Hi Joy, I’m interested in the ${frontmatter.title} journey. My travel dates are ____ and there will be ____ travelers.`)}`;
  const guidePrice = frontmatter.fromPrice > 0 ? `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}` : "Tailored quote after we confirm your dates and group";
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
    ...(frontmatter.fromPrice > 0 ? { offers: { "@type": "Offer", priceCurrency: frontmatter.currency, price: frontmatter.fromPrice, url: `https://hiddenchinatravel.com/journeys/${journey.slug}` } } : {}),
  };

  return <main>
    <SiteHeader />
    <header className="journey-hero">
      <Image src={frontmatter.coverImage} alt="Mountains and countryside along a Yunnan journey" fill priority unoptimized sizes="100vw" />
      <div className="journey-hero-shade" />
      <nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/journeys">Journeys</Link><span>›</span><span>{frontmatter.title}</span></nav>
      <div className="journey-hero-copy shell"><div><p>A PRIVATE YUNNAN JOURNEY</p><h1>{frontmatter.title}</h1><span>{frontmatter.excerpt}</span><div className="journey-hero-actions"><Link className="button journey-primary-action" href={whatsapp}>PLAN THIS JOURNEY</Link><Link className="journey-text-action" href="#itinerary">EXPLORE THE 6-DAY ITINERARY <b>↓</b></Link></div><small>Start with your dates and preferred pace. No pressure to book.</small></div></div>
    </header>

    <nav className="journey-anchor-nav journey-anchor-nav-quiet" aria-label="Jump to a section"><div className="shell"><span>Jump to:</span><div><Link href="#story">The feeling</Link><Link href="#experiences">Experiences</Link><Link href="#itinerary">Day-to-day itinerary</Link>{isDaliLijiangLuguLakeJourney ? <Link href="#local-team">Local team</Link> : null}<Link href="#pricing">Travel styles</Link><Link href="#details">What’s included</Link></div><Link className="journey-nav-contact" href={whatsapp}>Plan your journey →</Link></div></nav>

    <section className="journey-overview"><div className="shell"><div className="journey-overview-heading"><h2>Your private Yunnan journey, at a glance.</h2><p>A clear starting point for the route, with the details confirmed around your dates and group.</p></div><div className="journey-overview-items"><div><span>{frontmatter.duration.toUpperCase()}</span><b>{frontmatter.route}</b></div><div><span>YOUR JOURNEY</span><b>{frontmatter.journeyType} · Local guide · Private transport</b></div><div><span>GUIDE PRICE</span><b>{guidePrice}</b></div></div><Link href={whatsapp}>ASK JOY ABOUT THIS JOURNEY →</Link></div></section>

    <section className="journey-manifesto" id="story"><div className="shell journey-manifesto-grid"><div className="journey-manifesto-copy"><span>OUR WAY OF TRAVELLING</span><h2><span>Remember</span> <em>how Yunnan felt,</em> <span>not just where you went.</span></h2><i aria-hidden="true" /><p>{isDaliLijiangLuguLakeJourney ? "Morning light on Erhai Lake. A quiet lane in Lijiang. Two nights to settle into the slower pace beside Lugu Lake." : "A quiet evening in an old Tea Horse Road town. A conversation inside a traditional tie-dye workshop. A slow breakfast overlooking Erhai Lake."}</p><strong>The best memories are rarely made in a hurry.</strong></div></div></section>



    <section className="journey-fit"><div className="shell"><header><span>IS THIS YOUR KIND OF JOURNEY?</span><h2>For travelers who would rather go deeper than go faster.</h2></header><div className="journey-fit-columns"><div><h3>You’ll probably love it if you value…</h3>{goodFit.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><h3>It may not be for you if you want…</h3>{poorFit.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></div></section>

    <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="journey-editorial-heading"><span>THE MOMENTS THAT STAY WITH YOU</span><h2>Signature experiences</h2><p>Not additions made to fill an itinerary—moments chosen to give you more time with a place.</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={experience.image} alt={experience.title} fill sizes={index === 0 || index === 3 ? "(max-width: 700px) 100vw, 58vw" : "(max-width: 700px) 100vw, 42vw"} unoptimized /></div><span>0{index + 1} · EXPERIENCE</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section>

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>YOUR 6 DAYS IN YUNNAN</p><h2>A rhythm of arrival, discovery and rest.</h2><span>This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => {
      const isShaxi = isSixDayYunnanJourney && day.title.toLowerCase().includes("shaxi");
      return <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary><p>{day.description}</p>{day.meals ? <p className="journey-day-meals"><strong>MEALS</strong> {day.meals}</p> : null}{isDaliLijiangLuguLakeJourney ? <figure className="journey-day-photo"><Image src={routePhotos[index][0]} alt={routePhotos[index][1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized/><figcaption>{routePhotos[index][1]} · Destination photo</figcaption></figure> : null}{isShaxi ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, padding: "0 36px 32px 94px" }}><figure style={{ position: "relative", aspectRatio: "3 / 4", margin: 0, overflow: "hidden" }}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="Stone-paved lane between traditional buildings in Shaxi" fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized style={{ objectFit: "cover" }} /></figure><figure style={{ position: "relative", aspectRatio: "3 / 4", margin: 0, overflow: "hidden" }}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A shepherd and goats beside the river outside Shaxi" fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized style={{ objectFit: "cover" }} /></figure></div> : null}</details>;
    })}</div></div></section>

    <section className="journey-mid-cta"><div className="shell"><div><p>MAKE THE ROUTE YOURS</p><h2>{isDaliLijiangLuguLakeJourney ? "A gentler Day 4—or an extra night in Lijiang?" : "More time in Dali—or an extra night in Shaxi?"}</h2></div><div><Link href={whatsapp} className="button button-light">ASK JOY TO ADJUST THIS ROUTE</Link><span>Tell us what you would slow down, add or leave out.</span></div></div></section>

    <section className="journey-support section journey-support-flow"><div className="shell journey-section-layout"><header><p>PRIVATE TRAVEL, LOCAL SUPPORT</p><h2>A personal route, with local support along the way.</h2><span>Tell Joy how you want to travel. We’ll shape the plan with you, then a licensed local partner confirms and operates the trip.</span></header><div className="journey-support-grid">{[["01", "Tell Joy what matters", "Share your dates, group size and pace."], ["02", "Shape your route", "Review the hotels, guide and private transport in a written proposal."], ["03", "Travel with local support", "The licensed partner handles the contract and operates your journey."]].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    {isSixDayYunnanJourney ? <section className="journey-partner section section-sand" aria-labelledby="journey-partner-title"><div className="shell"><div className="journey-editorial-heading"><span>A LOOK AT LOCAL ARRANGEMENTS</span><h2 id="journey-partner-title">The people and transport behind your plans</h2><p>Our local partner has shared examples of private vehicles used for Yunnan trips. We discuss the vehicle size, guide language and hotel level with you before the final proposal.</p></div><div className="journey-partner-grid"><figure><div><Image src="/assets/partner/vehicles/seven-seat-cabin.webp" alt="Example of a seven-seat private vehicle cabin shared by the local partner" fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>Example of a seven-seat vehicle interior</figcaption></figure><figure><div><Image src="/assets/partner/vehicles/second-row-seating.webp" alt="Example of second-row seating in a private Yunnan vehicle" fill sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>Example of private vehicle seating</figcaption></figure></div><p className="journey-partner-note">These are examples from partner materials, not a promise of a specific vehicle. Your final proposal will confirm the actual transport, accommodation and guiding arrangements. The licensed local travel partner handles the booking, contract and trip operation.</p></div></section> : null}

    {isDaliLijiangLuguLakeJourney ? <HuataiServiceProof /> : null}

    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized /></div><div className="journey-host-copy"><span>YOUR LOCAL CONNECTION</span><h2>A Yunnan journey shaped by someone who calls it home.</h2><blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote><p>Joy Liu was born and raised in Yunnan. He helps you shape the route around what matters to you, then connects you with licensed local partners who arrange and operate the journey.</p><Link href="/about-us">MEET JOY →</Link></div></section>

    <section className="journey-pricing section section-sand" id="pricing"><div className="shell"><div className="journey-editorial-heading"><span>PRICING & TRAVEL STYLES</span><h2>{frontmatter.tiers.length ? "Choose the comfort level that fits you" : "A journey shaped around your dates"}</h2><p>{frontmatter.tiers.length ? "Three accommodation levels, with the same private and unhurried foundation." : "Five hotel nights and guiding are included. Vehicle, room types and exact inclusions are confirmed in a written proposal after we know your dates and group size."}</p></div>{frontmatter.tiers.length ? <div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">MOST POPULAR</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>per person</span></div><p>{tier.description}</p><ul><li>{tier.accommodation}</li><li>Private transportation</li><li>Local experiences</li><li>Journey support</li></ul><small>IDEAL FOR</small><strong>{tier.idealFor}</strong></article>)}</div> : <div className="journey-price-note"><b>Request a tailored quote.</b> The final proposal confirms the five named hotel nights, guide language, vehicle, attraction tickets and meals before you decide.</div>}<p className="journey-price-note">{frontmatter.tiers.length ? "Prices are shown in USD and are intended as a guide. " : ""}Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract.</p></div></section>

    <section className="journey-inclusions section journey-inclusions-compact" id="details"><div className="shell journey-inclusion-grid"><div><span className="journey-detail-label">THE DETAILS</span><h2>What’s included</h2>{(isDaliLijiangLuguLakeJourney ? ["Five hotel nights, with room types confirmed in your proposal", "Private vehicle, airport transfers, driver and local guide", "Listed meals, entry tickets, cable cars and boat trips", "Travel insurance, bottled water and listed mountain essentials"] : frontmatter.inclusions).map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><span className="journey-detail-label">GOOD TO KNOW</span><h2>What’s not included</h2>{(isDaliLijiangLuguLakeJourney ? ["Flights or trains to Dali and from Lijiang", "Personal spending and activities outside the itinerary", "Disruption costs outside the operator’s control"] : frontmatter.exclusions).map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

    {frontmatter.bookingNotes?.length ? <section className="journey-booking-notes section section-sand journey-booking-notes-compact" id="travel-notes"><div className="shell"><div className="journey-editorial-heading"><span>BEFORE YOU TRAVEL</span><h2>Good to know before you travel.</h2><p>Check these practical points as you choose your dates and pace.</p></div><div className="journey-booking-notes-grid">{(isDaliLijiangLuguLakeJourney ? frontmatter.bookingNotes.filter((note) => ["Private route, no compulsory shopping", "Mountain altitude and personal health", "Weather and access changes", "Departure timing"].includes(note.title)) : frontmatter.bookingNotes).map((note) => <details key={note.title}><summary>{note.title}<span aria-hidden="true">+</span></summary><p>{note.detail}</p></details>)}</div><p className="journey-booking-notes-source">For medical questions about high-elevation travel, consult your clinician and the <a href="https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html" target="_blank" rel="noopener noreferrer">CDC high-altitude guidance ↗</a>.</p></div></section> : null}

    <section className="journey-reading section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>PREPARE FOR THE JOURNEY</span><h2>Read the route before you travel it.</h2><p>Use these guides to understand the places, choose your pace and arrive with more useful context.</p></div><div className="journey-reading-grid">{(isDaliLijiangLuguLakeJourney ? journeyGuides.slice(0, 2) : journeyGuides).map((guide) => <GuideCard key={guide.href} guide={guide} />)}</div></div></section>

    <section className="journey-faq section"><div className="narrow"><div className="section-heading"><h2>Frequently asked questions</h2></div>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Planning starts with a conversation.</h2><span>Send Joy your dates, group size and preferred travel pace. We’ll help you decide whether this journey is the right fit.</span><Link href={whatsapp} className="button button-light">PLAN THIS JOURNEY</Link></div></section>
    <Link href={whatsapp} className="journey-mobile-cta">PLAN THIS JOURNEY <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
