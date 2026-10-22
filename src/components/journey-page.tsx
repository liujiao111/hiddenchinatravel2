import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { QuickAsk } from "@/components/quick-ask";
import { formatPriceLabel } from "@/lib/format-price";
import { JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { MuslimFriendly } from "@/components/muslim-friendly";
import { YunnanTravelNotes } from "@/components/yunnan-travel-notes";
import { bookingDocumentHref, bookingTermCards } from "@/lib/booking-terms";
import { getSelectedTestimonials, selectedTestimonialsCopy } from "@/lib/testimonials";
import { breadcrumbList } from "@/components/json-ld";

const sixDayPhotos: Record<string, readonly [string, string]> = {
  "Day 1": ["/assets/blog/dali-travel-guide/dali-ancient-town-rooftops.webp", "Rooftops in Dali Old Town, with Cangshan behind"],
  "Day 2": ["/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", "Erhai Lake, with Cangshan across the water"],
  "Day 3": ["/assets/journeys/kunming-dali-shaxi-lijiang-6-days/shaxi-yujin-bridge.webp", "Yujin Bridge on the edge of Shaxi"],
  "Day 4": ["/assets/blog/dali-hidden-gems-off-the-beaten-path/shibaoshan-grotto-temple.webp", "Stone grotto temple at Shibaoshan in the hills above Shaxi"],
  "Day 5": ["/assets/destinations/yunnan/blue-moon.webp", "Blue Moon Valley below Jade Dragon Snow Mountain"],
  "Day 6": ["/assets/blog/yunnan-travel-from-uk/lijiang-old-town.webp", "A canal lane in Lijiang Old Town"],
};

export function JourneyPage({ journey }: { journey: Journey }) {
  const { frontmatter } = journey;
  const stories = getSelectedTestimonials();
  const isSixDayYunnanJourney = journey.slug === "kunming-dali-shaxi-lijiang-6-days";
  const whatsapp = `https://wa.me/8618880441791?text=${encodeURIComponent(`Hi Joy, I’m interested in the ${frontmatter.title} journey. My travel dates are ____ and there will be ____ travelers.`)}`;
  const guidePrice = frontmatter.fromPrice > 0 ? `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}` : "Tailored quote after we confirm your dates and group";
  const overviewItems = frontmatter.overviewItems ?? [
    { label: frontmatter.duration.toUpperCase(), value: frontmatter.route },
    { label: "YOUR JOURNEY", value: `${frontmatter.journeyType} · Driver-guide · Private transport` },
    { label: "GUIDE PRICE", value: guidePrice },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: frontmatter.title,
        description: frontmatter.metaDescription,
        image: `https://hiddenchinatravel.com${frontmatter.coverImage}`,
        touristType: frontmatter.travelStyles,
        itinerary: frontmatter.route,
        provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" },
        ...(frontmatter.fromPrice > 0 ? { offers: { "@type": "Offer", priceCurrency: frontmatter.currency, price: frontmatter.fromPrice, url: `https://hiddenchinatravel.com/journeys/${journey.slug}` } } : {}),
      },
      breadcrumbList([
        { name: "Home", href: "/" },
        { name: "Journeys", href: "/journeys" },
        { name: frontmatter.title, href: `/journeys/${journey.slug}` },
      ]),
    ],
  };

  return <main>
    <SiteHeader />
    <JourneyHero title={frontmatter.title} image={frontmatter.coverImage} imageAlt={frontmatter.coverAlt || "Mountains and countryside along a Yunnan journey"} eyebrow={frontmatter.heroEyebrow || "A PRIVATE YUNNAN JOURNEY"} description={frontmatter.heroDescription || frontmatter.excerpt} price={frontmatter.fromPrice > 0 ? `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}` : undefined} primary={{ href: whatsapp, label: "PLAN THIS JOURNEY" }} secondary={{ href: "#itinerary", label: frontmatter.heroSecondaryLabel || "EXPLORE THE 6-DAY ITINERARY" }} note={frontmatter.heroNote || "Start with your dates and preferred pace. No pressure to book."} />
    <JourneySectionNav links={[{ href: "#itinerary", label: "Day-to-day itinerary" }, ...(stories.length > 0 ? [{ href: "#stories", label: "Stories" }] : []), { href: "#local-team", label: "Guide, vehicle & hotels" }, { href: "#pricing", label: "Price" }, { href: "#details", label: "What’s included" }, { href: "#booking-terms", label: "Before you book" }]} action={{ href: whatsapp, label: "Plan your journey" }} />
    <JourneyOverview title={frontmatter.overviewTitle || "Your private Yunnan journey, at a glance."} description={frontmatter.overviewDescription || "A clear starting point for the route, with the details confirmed around your dates and group."} items={overviewItems} action={{ href: whatsapp, label: "ASK JOY ABOUT THIS JOURNEY" }} />
    <MuslimFriendly />

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>{frontmatter.itineraryKicker || "YOUR 6 DAYS IN YUNNAN"}</p><h2>{frontmatter.itineraryHeading || (isSixDayYunnanJourney ? "Give Jade Dragon Snow Mountain a full day of its own." : "A rhythm of arrival, discovery and rest.")}</h2><span>{frontmatter.itineraryIntro || (isSixDayYunnanJourney ? "Two nights in Dali, one night in Shaxi, two nights in Lijiang. Day 5 is the mountain. Hotel breakfast is generally included. Lunch and dinner are not." : "This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.")}</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => {
      const dayPhoto = day.image ? [day.image, day.imageAlt || day.title] as const : isSixDayYunnanJourney ? sixDayPhotos[day.days] : undefined;
      const isShaxiStay = isSixDayYunnanJourney && day.days === "Day 3";
      const dayCopy = day.description.split(/\n\n+/);
      return <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary>{dayCopy.map((paragraph, paragraphIndex) => <p key={`${day.days}-${paragraphIndex}`}>{paragraph}</p>)}{day.meals ? <p className="journey-day-meals"><strong>{/Overnight|Pace:/.test(day.meals) ? "THE DAY" : "MEALS"}</strong> {day.meals}</p> : null}{dayPhoto ? <figure className="journey-day-photo"><Image src={encodeURI(dayPhoto[0])} alt={dayPhoto[1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>{dayPhoto[1]}</figcaption></figure> : null}{isShaxiStay ? <div className="journey-day-pair"><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="Stone-paved lane between traditional buildings in Shaxi" fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A shepherd and goats beside the river outside Shaxi" fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized /></figure></div> : null}</details>;
    })}</div></div></section>

    {stories.length > 0 ? <Testimonials items={stories} eyebrow={selectedTestimonialsCopy.eyebrow} heading={selectedTestimonialsCopy.heading} intro={selectedTestimonialsCopy.intro} showRating={false} note={selectedTestimonialsCopy.note} /> : null}

    <JourneyTrustSection />

    <section className="journey-pricing section section-sand" id="pricing"><div className="shell"><div className="journey-editorial-heading"><span>PRICE</span><h2>{frontmatter.pricingHeading || (frontmatter.tiers.length ? "Choose a hotel style" : "A journey shaped around your dates")}</h2><p>{frontmatter.pricingIntro || (frontmatter.tiers.length ? "Premium is our recommended option. Starting prices on cards and listings use the Comfort rate." : "Five hotel nights and guiding are included. Vehicle, room types and exact inclusions are confirmed in a written proposal after we know your dates and group size.")}</p></div>{frontmatter.tiers.length ? <div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">RECOMMENDED</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>per person</span></div><p>{tier.description}</p><ul><li>{tier.accommodation}</li><li>Private transportation</li><li>Local experiences</li><li>Journey support</li></ul><small>IDEAL FOR</small><strong>{tier.idealFor}</strong></article>)}</div> : <div className="journey-price-note">{frontmatter.priceExplanation ? <><b>{guidePrice} for the complete journey.</b> {frontmatter.priceExplanation}</> : <><b>Request a tailored quote.</b> The final proposal confirms the five named hotel nights, guide language, vehicle, attraction tickets and meals before you decide.</>}</div>}{frontmatter.tiers.length ? <p className="journey-price-note">{frontmatter.priceExplanation || "Prices are shown in USD and are intended as a guide. Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract."}</p> : frontmatter.priceExplanation ? null : <p className="journey-price-note">Final pricing depends on travel dates, group size, hotel availability and any route customizations. Your licensed local travel partner will provide the final proposal and contract.</p>}
    <div className="journey-quote-ask"><h3>Ask Joy to price this route for your dates.</h3><p>A group size, a month and a budget are enough. You will get a route sketch and a range before anyone asks you to book. Prefer a chat? Use WhatsApp and send the same three facts.</p><QuickAsk layout="embedded" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.title} intent="trip" /></div></div></section>

    <section className="journey-inclusions section journey-inclusions-compact" id="details"><div className="shell journey-inclusion-grid"><div><span className="journey-detail-label">THE DETAILS</span><h2>What’s included</h2>{frontmatter.inclusions.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><span className="journey-detail-label">GOOD TO KNOW</span><h2>What’s not included</h2>{frontmatter.exclusions.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

    <section className="journey-booking-notes section section-sand journey-booking-notes-compact" id="booking-terms">
      <div className="shell">
        <div className="journey-editorial-heading">
          <span>BEFORE YOU BOOK</span>
          <h2>Payment, the contract, and notes for this route.</h2>
          <p>The same booking terms on every journey. Route-specific notes sit with them, collapsed until you need them.</p>
        </div>
        <div className="journey-booking-notes-grid">
          {bookingTermCards.map(([title, detail]) => <details key={title}><summary>{title}<span aria-hidden="true">+</span></summary><p>{detail}</p></details>)}
          {frontmatter.bookingNotes?.map((note) => <details key={note.title}><summary>{note.title}<span aria-hidden="true">+</span></summary><p>{note.detail}</p></details>)}
        </div>
        {frontmatter.bookingNotes?.length ? <p className="journey-booking-notes-source">For medical questions about high-elevation travel, consult your clinician and the <a href="https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html" target="_blank" rel="noopener noreferrer">CDC high-altitude guidance ↗</a>. <Link href={bookingDocumentHref}>Read the full booking and service note →</Link></p> : <><YunnanTravelNotes /><p className="journey-booking-notes-source"><Link href={bookingDocumentHref}>Read the full booking and service note →</Link></p></>}
      </div>
    </section>

    <section className="journey-faq section" id="questions"><div className="narrow"><div className="section-heading"><h2>Frequently asked questions</h2></div>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Planning starts with a conversation.</h2><span>Send Joy your dates, group size and preferred travel pace. We’ll help you decide whether this journey is the right fit.</span><Link href={whatsapp} className="button button-light">PLAN THIS JOURNEY</Link><Link href="/custom-china-tour" className="journey-final-alt" data-cta-location="journey_custom_alternative">A different date or route? Explore tailor-made Yunnan →</Link></div></section>
    <Link href={whatsapp} className="journey-mobile-cta">PLAN THIS JOURNEY <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
