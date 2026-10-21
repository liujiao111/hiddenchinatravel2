import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { ContentFooter } from "@/components/content-footer";
import { GuideCard } from "@/components/guide-card";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { QuickAsk } from "@/components/quick-ask";
import { formatPriceLabel } from "@/lib/format-price";
import { JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { YunnanTravelNotes } from "@/components/yunnan-travel-notes";
import { licensedOperator } from "@/lib/journey-trust";
import { getTestimonialsForJourney, overallGuestRating, overallGuestRatingLabel } from "@/lib/testimonials";

const sixDayPhotos: Record<string, readonly [string, string]> = {
  "Day 1": ["/assets/blog/dali-travel-guide/dali-ancient-town-rooftops.webp", "Rooftops in Dali Old Town, with Cangshan behind"],
  "Day 2": ["/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", "Erhai Lake, with Cangshan across the water"],
  "Day 3": ["/assets/journeys/kunming-dali-shaxi-lijiang-6-days/shaxi-yujin-bridge-rod-waddington.jpg", "Yujin Bridge on the edge of Shaxi"],
  "Day 5": ["/assets/resources/丽江-丽江古城-248.jpg", "A canal lane in Lijiang Old Town"],
  "Day 6": ["/assets/resources/丽江-蓝月谷-316.jpg", "Blue Moon Valley below Jade Dragon Snow Mountain"],
};

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
  const stories = getTestimonialsForJourney(journey.slug);
  const storiesFromThisJourney = stories.some((story) => story.journeySlugs.includes(journey.slug));
  const isDaliLijiangLuguLakeJourney = journey.slug === "dali-lijiang-lugu-lake-private-tour";
  const isSixDayYunnanJourney = journey.slug === "kunming-dali-shaxi-lijiang-6-days";
  const isClassicYunnanJourney = journey.slug === "kunming-dali-lijiang-shangri-la-private-tour";
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
  const selectedGoodFit = frontmatter.goodFit ?? goodFit;
  const selectedPoorFit = frontmatter.poorFit ?? poorFit;
  const overviewItems = frontmatter.overviewItems ?? [
    { label: frontmatter.duration.toUpperCase(), value: frontmatter.route },
    { label: "YOUR JOURNEY", value: `${frontmatter.journeyType} · Local guide · Private transport` },
    { label: "GUIDE PRICE", value: guidePrice },
  ];
  const relatedGuides = isDaliLijiangLuguLakeJourney || isClassicYunnanJourney ? journeyGuides.slice(0, 2) : journeyGuides;
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
    <JourneyHero title={frontmatter.title} image={frontmatter.coverImage} imageAlt={frontmatter.coverAlt || "Mountains and countryside along a Yunnan journey"} eyebrow={frontmatter.heroEyebrow || "A PRIVATE YUNNAN JOURNEY"} description={frontmatter.excerpt} primary={{ href: whatsapp, label: "PLAN THIS JOURNEY" }} secondary={{ href: "#itinerary", label: frontmatter.heroSecondaryLabel || "EXPLORE THE 6-DAY ITINERARY" }} note={frontmatter.heroNote || "Start with your dates and preferred pace. No pressure to book."} rating={stories.length > 0 ? { href: "#stories", label: overallGuestRatingLabel, value: overallGuestRating } : undefined} />
    <JourneySectionNav links={[{ href: "#story", label: "The feeling" }, { href: "#experiences", label: "Experiences" }, { href: "#itinerary", label: "Day-to-day itinerary" }, ...(stories.length > 0 ? [{ href: "#stories", label: "Stories" }] : []), { href: "#local-team", label: "Local team" }, { href: "#pricing", label: frontmatter.tiers.length ? "Travel styles" : "Pricing" }, { href: "#details", label: "What’s included" }, { href: frontmatter.bookingNotes?.length ? "#travel-notes" : "#yunnan-notes", label: "Travel notes" }]} action={{ href: whatsapp, label: "Plan your journey" }} />
    <JourneyOverview title={frontmatter.overviewTitle || "Your private Yunnan journey, at a glance."} description={frontmatter.overviewDescription || "A clear starting point for the route, with the details confirmed around your dates and group."} items={overviewItems} action={{ href: whatsapp, label: "ASK JOY ABOUT THIS JOURNEY" }} />

    <section className="journey-manifesto" id="story"><div className="shell journey-manifesto-grid"><div className="journey-manifesto-copy"><span>{frontmatter.manifestoKicker || "OUR WAY OF TRAVELLING"}</span><h2><span>Remember</span> <em>how Yunnan felt,</em> <span>not just where you went.</span></h2><i aria-hidden="true" /><p>{frontmatter.manifestoLead || (isDaliLijiangLuguLakeJourney ? "Morning light on Erhai Lake. A quiet lane in Lijiang. Two nights to settle into the slower pace beside Lugu Lake." : "A quiet evening in an old Tea Horse Road town. A conversation inside a traditional tie-dye workshop. A slow breakfast overlooking Erhai Lake.")}</p><strong>{frontmatter.manifestoClose || "The best memories are rarely made in a hurry."}</strong></div></div></section>



    <section className="journey-fit"><div className="shell"><header><span>{frontmatter.fitKicker || "IS THIS YOUR KIND OF JOURNEY?"}</span><h2>{frontmatter.fitHeading || "For travelers who would rather go deeper than go faster."}</h2></header><div className="journey-fit-columns"><div><h3>You’ll probably love it if you value…</h3>{selectedGoodFit.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><h3>It may not be for you if you want…</h3>{selectedPoorFit.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></div></section>

    <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="journey-editorial-heading"><span>THE MOMENTS THAT STAY WITH YOU</span><h2>Signature experiences</h2><p>Not additions made to fill an itinerary—moments chosen to give you more time with a place.</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={encodeURI(experience.image)} alt={experience.title} fill sizes={index === 0 || index === 3 ? "(max-width: 700px) 100vw, 58vw" : "(max-width: 700px) 100vw, 42vw"} unoptimized /></div><span>0{index + 1} · EXPERIENCE</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section>

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>{frontmatter.itineraryKicker || "YOUR 6 DAYS IN YUNNAN"}</p><h2>{frontmatter.itineraryHeading || (isSixDayYunnanJourney ? "Stay in Shaxi after the day trips have left." : "A rhythm of arrival, discovery and rest.")}</h2><span>{frontmatter.itineraryIntro || (isSixDayYunnanJourney ? "A morning on Erhai, indigo in Zhoucheng, the old square once the coaches have gone, then a day under Jade Dragon Snow Mountain. Hotel breakfast is generally included. Lunch and dinner are not. The days can still move around your dates." : "This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.")}</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => {
      const dayPhoto = day.image ? [day.image, day.imageAlt || day.title] as const : isSixDayYunnanJourney ? sixDayPhotos[day.days] : isDaliLijiangLuguLakeJourney ? routePhotos[index] : undefined;
      const isShaxiStay = isSixDayYunnanJourney && day.days === "Day 4";
      return <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary><p>{day.description}</p>{day.meals ? <p className="journey-day-meals"><strong>{/Overnight|Pace:/.test(day.meals) ? "THE DAY" : "MEALS"}</strong> {day.meals}</p> : null}{dayPhoto ? <figure className="journey-day-photo"><Image src={encodeURI(dayPhoto[0])} alt={dayPhoto[1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>{dayPhoto[1]}</figcaption></figure> : null}{isShaxiStay ? <div className="journey-day-pair"><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="Stone-paved lane between traditional buildings in Shaxi" fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A shepherd and goats beside the river outside Shaxi" fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized /></figure></div> : null}</details>;
    })}</div></div></section>

    <section className="journey-mid-cta"><div className="shell"><div><p>MAKE THE ROUTE YOURS</p><h2>{frontmatter.midCtaHeading || (isDaliLijiangLuguLakeJourney ? "A gentler Day 4—or an extra night in Lijiang?" : "More time in Dali—or an extra night in Shaxi?")}</h2></div><div><Link href={whatsapp} className="button button-light">ASK JOY TO ADJUST THIS ROUTE</Link><span>Tell us what you would slow down, add or leave out.</span></div></div></section>

    {stories.length > 0 ? <Testimonials items={stories} heading={storiesFromThisJourney ? "Travelers on this journey" : "What travelers remember"} intro={storiesFromThisJourney ? "Words from guests who explored this route with Joy and our local partners." : "Words from guests who explored Yunnan with Joy and our local partners."} /> : null}

    <section className="journey-support section journey-support-flow"><div className="shell journey-section-layout"><header><p>PRIVATE TRAVEL, LOCAL SUPPORT</p><h2>A personal route, with local support along the way.</h2><span>Tell Joy how you want to travel. We’ll shape the plan with you, then {licensedOperator.nameEn} confirms and operates the trip.</span></header><div className="journey-support-grid">{[["01", "Tell Joy what matters", "Share your dates, group size and pace."], ["02", "Shape your route", "Review the hotels, guide and private transport in a written proposal."], ["03", "Travel with local support", `${licensedOperator.nameEn} handles the contract and operates your journey.`]].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <JourneyTrustSection />

    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized /></div><div className="journey-host-copy"><span>YOUR LOCAL CONNECTION</span><h2>A Yunnan journey shaped by someone who calls it home.</h2><blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote><p>Joy Liu was born and raised in Yunnan. He helps you shape the route around what matters to you, then {licensedOperator.nameEn} arranges and operates the journey.</p><Link href="/about-us">MEET JOY →</Link></div></section>

    <section className="journey-pricing section section-sand" id="pricing"><div className="shell"><div className="journey-editorial-heading"><span>PRICING & TRAVEL STYLES</span><h2>{frontmatter.pricingHeading || (frontmatter.tiers.length ? "Choose the comfort level that fits you" : "A journey shaped around your dates")}</h2><p>{frontmatter.pricingIntro || (frontmatter.tiers.length ? "Three accommodation levels, with the same private and unhurried foundation." : "Five hotel nights and guiding are included. Vehicle, room types and exact inclusions are confirmed in a written proposal after we know your dates and group size.")}</p></div>{frontmatter.tiers.length ? <div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">MOST POPULAR</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>per person</span></div><p>{tier.description}</p><ul><li>{tier.accommodation}</li><li>Private transportation</li><li>Local experiences</li><li>Journey support</li></ul><small>IDEAL FOR</small><strong>{tier.idealFor}</strong></article>)}</div> : <div className="journey-price-note">{frontmatter.priceExplanation ? <><b>{guidePrice} for the complete journey.</b> {frontmatter.priceExplanation}</> : <><b>Request a tailored quote.</b> The final proposal confirms the five named hotel nights, guide language, vehicle, attraction tickets and meals before you decide.</>}</div>}{frontmatter.priceExplanation ? null : <p className="journey-price-note">{frontmatter.tiers.length ? "Prices are shown in USD and are intended as a guide. " : ""}Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract.</p>}
    <div className="journey-quote-ask"><h3>Ask Joy to price this route for your dates.</h3><p>A group size, a month and a budget are enough. You will get a route sketch and a range before anyone asks you to book. Prefer a chat? Use WhatsApp and send the same three facts.</p><QuickAsk layout="embedded" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.title} intent="trip" /></div></div></section>

    <section className="journey-inclusions section journey-inclusions-compact" id="details"><div className="shell journey-inclusion-grid"><div><span className="journey-detail-label">THE DETAILS</span><h2>What’s included</h2>{frontmatter.inclusions.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><span className="journey-detail-label">GOOD TO KNOW</span><h2>What’s not included</h2>{frontmatter.exclusions.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

    {frontmatter.bookingNotes?.length ? null : <YunnanTravelNotes />}

    {frontmatter.bookingNotes?.length ? <section className="journey-booking-notes section section-sand journey-booking-notes-compact" id="travel-notes"><div className="shell"><div className="journey-editorial-heading"><span>BEFORE YOU TRAVEL</span><h2>Good to know before you travel.</h2><p>Check these practical points as you choose your dates and pace.</p></div><div className="journey-booking-notes-grid">{frontmatter.bookingNotes.map((note) => <details key={note.title}><summary>{note.title}<span aria-hidden="true">+</span></summary><p>{note.detail}</p></details>)}</div><p className="journey-booking-notes-source">For medical questions about high-elevation travel, consult your clinician and the <a href="https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html" target="_blank" rel="noopener noreferrer">CDC high-altitude guidance ↗</a>.</p></div></section> : null}

    <section className="journey-reading section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>PREPARE FOR THE JOURNEY</span><h2>Read the route before you travel it.</h2><p>Use these guides to understand the places, choose your pace and arrive with more useful context.</p></div><div className="journey-reading-grid">{relatedGuides.map((guide) => <GuideCard key={guide.href} guide={guide} />)}</div></div></section>

    <section className="journey-faq section"><div className="narrow"><div className="section-heading"><h2>Frequently asked questions</h2></div>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="custom-route-bridge section section-sand"><div className="narrow"><h2>Looking for a different journey?</h2><p>Different dates, more time, or somewhere else in mind? Start with your own plans and we’ll discuss a route shaped around you.</p><Link href="/custom-china-tour" data-cta-location="journey_custom_alternative">EXPLORE TAILOR-MADE JOURNEYS →</Link></div></section>

    <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Planning starts with a conversation.</h2><span>Send Joy your dates, group size and preferred travel pace. We’ll help you decide whether this journey is the right fit.</span><Link href={whatsapp} className="button button-light">PLAN THIS JOURNEY</Link></div></section>
    <Link href={whatsapp} className="journey-mobile-cta">PLAN THIS JOURNEY <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}

