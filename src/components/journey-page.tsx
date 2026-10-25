import Image from "next/image";
import Link from "next/link";
import type { Journey } from "@/lib/journeys";
import { ContentFooter } from "@/components/content-footer";
import { HashLink } from "@/components/hash-link";
import { JourneyMobileCta } from "@/components/journey-mobile-cta";
import { SiteHeader } from "@/components/site-header";
import { QuickAsk } from "@/components/quick-ask";
import { formatPriceLabel } from "@/lib/format-price";
import { JourneyFactCards, JourneyHero, JourneyOverview } from "@/components/journey-landing";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { JourneyPractical } from "@/components/journey-practical";
import { JourneyWhy } from "@/components/journey-why";
import { Testimonials } from "@/components/testimonials";
import { licensedOperator } from "@/lib/journey-trust";
import { getSelectedTestimonials, guestReviewCount, overallGuestRating, overallGuestRatingLabel, selectedTestimonialsCopy } from "@/lib/testimonials";
import { YunnanTravelNotes } from "@/components/yunnan-travel-notes";
import { breadcrumbList } from "@/components/json-ld";

const sixDayGuestProof = [
  ["/assets/customers/客户2.1.webp", "A private party at the 4,506 m Glacier Park platform on Jade Dragon Snow Mountain", "4,506 m platform"],
  ["/assets/customers/客户2.3.webp", "The same private party at Blue Moon Valley, below Jade Dragon Snow Mountain", "Blue Moon Valley"],
] as const;

const sixDayPhotos: Record<string, readonly [string, string]> = {
  "Day 1": ["/assets/blog/dali-travel-guide/dali-ancient-town-rooftops.webp", "Rooftops in Dali Old Town, with Cangshan behind"],
  "Day 2": ["/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", "Erhai Lake, with Cangshan across the water"],
  "Day 3": ["/assets/journeys/kunming-dali-shaxi-lijiang-6-days/shaxi-yujin-bridge.webp", "Yujin Bridge on the edge of Shaxi"],
  "Day 4": ["/assets/blog/dali-hidden-gems-off-the-beaten-path/shibaoshan-grotto-temple.webp", "Stone grotto temple at Shibaoshan in the hills above Shaxi"],
  "Day 5": ["/assets/destinations/yunnan/blue-moon.webp", "Blue Moon Valley below Jade Dragon Snow Mountain"],
  "Day 6": ["/assets/blog/yunnan-travel-from-uk/lijiang-old-town.webp", "A canal lane in Lijiang Old Town"],
};

const defaultIncludes = [
  "Private party · no shopping stops",
  "Muslim-friendly as standard",
  "Private driver-guide throughout",
  "Hotels in your chosen style, with breakfast",
  "Licensed Kunming agency for the contract",
];

const sharedTierPoints = [
  "Private driver-guide and vehicle",
  "Hotel breakfast · lunch and dinner not included",
];

const planPoints = ["Personalised itinerary", "Handpicked hotels", "Private driver-guide", "Flexible travel dates"];

function JourneyQuoteBand({ id, source, sourceTitle, whatsapp, showRouteLink }: { id: string; source: string; sourceTitle: string; whatsapp: string; showRouteLink?: boolean }) {
  return <section className="journey-quote-band">
    <div className="shell journey-plan">
      <h2>Start Planning Your Yunnan Journey</h2>
      <ul className="journey-plan-points">{planPoints.map((point) => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul>
      <a className="button journey-plan-whatsapp" href={whatsapp} data-cta-location={`journey_plan_whatsapp_${id}`}>Chat on WhatsApp</a>
      <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      {showRouteLink ? <div className="journey-quote-links"><Link href="/custom-china-tour" data-cta-location="journey_custom_alternative">A different date or route? Explore tailor-made Yunnan →</Link></div> : null}
    </div>
  </section>;
}

export function JourneyPage({ journey }: { journey: Journey }) {
  const { frontmatter } = journey;
  const isSixDayYunnanJourney = journey.slug === "kunming-dali-shaxi-lijiang-6-days";
  const stories = getSelectedTestimonials();
  const whatsapp = `https://wa.me/8618880441791?text=${encodeURIComponent(`Hi Joy, I’m interested in the ${frontmatter.title} journey. My travel dates are ____ and there will be ____ travelers.`)}`;
  const completePrice = frontmatter.fromPrice > 0
    ? `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} per person for the complete ${frontmatter.duration.split("/")[0].trim().toLowerCase()}`
    : "Tailored quote after we confirm your dates and group";
  const guidePrice = frontmatter.fromPrice > 0 ? `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}` : "Tailored quote after we confirm your dates and group";
  const overviewItems = frontmatter.overviewItems ?? [
    { label: frontmatter.duration.toUpperCase(), value: frontmatter.route },
    { label: "YOUR JOURNEY", value: `${frontmatter.journeyType} · Driver-guide · Private transport` },
    { label: "GUIDE PRICE", value: guidePrice },
  ];
  const heroIncludes = frontmatter.heroIncludes ?? defaultIncludes;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: frontmatter.heroTitle || frontmatter.title,
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

  return <main className="journey-page">
    <SiteHeader conversion cta={{ href: "#ask-joy", label: isSixDayYunnanJourney ? "CHAT ON WHATSAPP" : "GET A QUOTE", location: "header_journey_price" }} />
    <JourneyHero
      title={frontmatter.heroTitle || frontmatter.title}
      name={frontmatter.heroTitle ? frontmatter.title : undefined}
      image={frontmatter.coverImage}
      imageAlt={frontmatter.coverAlt || "Mountains and countryside along a Yunnan journey"}
      eyebrow={frontmatter.heroEyebrow || "A PRIVATE YUNNAN JOURNEY"}
      description={frontmatter.heroDescription || frontmatter.excerpt}
      price={frontmatter.fromPrice > 0 ? completePrice : undefined}
      includes={heroIncludes}
      bounds={frontmatter.heroBounds}
      rating={{ href: "#stories", label: overallGuestRatingLabel, value: overallGuestRating }}
      primary={{ href: isSixDayYunnanJourney ? whatsapp : "#ask-joy", label: isSixDayYunnanJourney ? "CHAT ON WHATSAPP" : "GET A QUOTE" }}
      secondary={{ href: "#itinerary", label: frontmatter.heroSecondaryLabel || "SEE THE DAYS" }}
      chat={{ href: isSixDayYunnanJourney ? "#ask-joy" : whatsapp, label: isSixDayYunnanJourney ? "Prefer email? Get my trip plan →" : "Prefer WhatsApp? Message Joy →" }}
      note={frontmatter.heroNote || "Two adults sharing one room. Not a daily rate. Hotel breakfast is generally included; lunch and dinner are not."}
    />
    <section className="journey-fold-ask" id="quote">
      <div className="shell">
        {isSixDayYunnanJourney ? <div className="journey-guest-proof">
          <p>GUESTS ON THIS ROUTE</p>
          <div className="journey-guest-proof-row">
            {sixDayGuestProof.map(([src, alt, caption]) => <figure key={src}>
              <Image src={encodeURI(src)} alt={alt} fill sizes="(max-width:700px) 46vw, 420px" unoptimized />
              <figcaption>{caption}</figcaption>
            </figure>)}
          </div>
          <p>A private party on Day 5: the 4,506 m platform and Blue Moon Valley.</p>
        </div> : <div className="journey-quote-ask">
          <h3>Get a quote for your dates.</h3>
          <p>{completePrice}. A month, group size and hotel style are enough. Joy replies with a range for those dates — nothing is booked.</p>
          <QuickAsk layout="embedded" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} intent="trip" />
          <p className="journey-quote-contract">Joy replies to this note.</p>
        </div>}
      </div>
    </section>
    {isSixDayYunnanJourney ? <JourneyQuoteBand id="ask-joy" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} /> : null}
    <JourneyFactCards id="why-travel" title="Why travel with us?" cards={[
      { icon: "party", title: "Private party", lines: ["Your own driver-guide and vehicle", "No shopping stops", "Arranged around your dates"] },
      { icon: "person", title: "Planned with Joy", lines: ["Joy Liu plans from Kunming", "You speak with him from the first enquiry through the trip", "He was born in Yunnan"] },
      { icon: "licence", title: "Licensed agency", lines: [licensedOperator.nameEn.replace(" Co., Ltd.", ""), `Permit ${licensedOperator.permitNumber}`, "The contract and payments are with this agency"] },
      { icon: "star", title: "Guest reviews", lines: [`${overallGuestRating} out of 5`, `${guestReviewCount} guest reviews`, "Private Yunnan journeys, this route included"] },
    ]} />
    <JourneyWhy />
    <JourneyOverview title={frontmatter.overviewTitle || "At a glance."} description={frontmatter.overviewDescription || "A clear starting point for the route, with the details confirmed around your dates and group."} items={overviewItems} action={{ href: isSixDayYunnanJourney ? whatsapp : "#ask-joy", label: isSixDayYunnanJourney ? "CHAT ON WHATSAPP" : "GET A QUOTE" }} />
    {frontmatter.whoFor || frontmatter.whenToGo ? <section className="journey-fit-season"><div className="shell">{frontmatter.whoFor ? <article><span>WHO IT’S FOR</span><p>{frontmatter.whoFor}</p></article> : null}{frontmatter.whenToGo ? <article><span>WHEN TO GO</span><p>{frontmatter.whenToGo}</p></article> : null}</div></section> : null}

    {frontmatter.experiences.length ? <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="section-heading"><h2>Signature experiences</h2><p>{isSixDayYunnanJourney ? "The moments this route is built around: Erhai’s west shore, indigo in Zhoucheng, one night in Shaxi, and a full day on Jade Dragon Snow Mountain." : "A journey built around moments, local people and enough time to take them in."}</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={experience.image} alt={experience.imageAlt || experience.title} fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><span>0{index + 1}</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section> : null}

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>{frontmatter.itineraryKicker || "DAY BY DAY"}</p><h2>{frontmatter.itineraryHeading || (isSixDayYunnanJourney ? "Give Jade Dragon Snow Mountain a full day of its own." : "A rhythm of arrival, discovery and rest.")}</h2><span>{frontmatter.itineraryIntro || (isSixDayYunnanJourney ? "Two nights in Dali, one night in Shaxi, two nights in Lijiang. Day 5 is the mountain. Hotel breakfast is generally included. Lunch and dinner are not." : "This is a starting point rather than a rigid package. We can adjust the route around your dates and preferred pace.")}</span></header><div className="journey-days">{frontmatter.itinerary.map((day, index) => {
      const dayPhoto = day.image ? [day.image, day.imageAlt || day.title] as const : isSixDayYunnanJourney ? sixDayPhotos[day.days] : undefined;
      const isShaxiStay = isSixDayYunnanJourney && day.days === "Day 3";
      const isJadeDragonDay = isSixDayYunnanJourney && day.days === "Day 5";
      const dayCopy = day.description.split(/\n\n+/);
      return <details key={day.days} open={index === 0}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary>{dayCopy.map((paragraph, paragraphIndex) => <p key={`${day.days}-${paragraphIndex}`}>{paragraph}</p>)}{day.meals ? <p className="journey-day-meals"><strong>{/Overnight|Pace:/.test(day.meals) ? "THE DAY" : "MEALS"}</strong> {day.meals}</p> : null}{dayPhoto ? <figure className="journey-day-photo"><Image src={encodeURI(dayPhoto[0])} alt={dayPhoto[1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>{dayPhoto[1]}</figcaption></figure> : null}{isJadeDragonDay ? <figure className="journey-day-photo journey-day-guest"><Image src={encodeURI(sixDayGuestProof[0][0])} alt={sixDayGuestProof[0][1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>Guests on this day, at the 4,506 m platform</figcaption></figure> : null}{isShaxiStay ? <div className="journey-day-pair"><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="Stone-paved lane between traditional buildings in Shaxi" fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A shepherd and goats beside the river outside Shaxi" fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized /></figure></div> : null}</details>;
    })}</div></div></section>

    {stories.length > 0 ? <Testimonials items={stories} eyebrow={selectedTestimonialsCopy.eyebrow} heading={selectedTestimonialsCopy.heading} intro={selectedTestimonialsCopy.intro} showRating={false} note={selectedTestimonialsCopy.note} /> : null}

    <section className="journey-price-module" id="pricing">
      {frontmatter.tiers.length ? <section className="journey-pricing section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>PRICE</span><h2>{frontmatter.pricingHeading || "Choose a hotel style"}</h2><p>{frontmatter.pricingIntro || "Starting prices are per person for the complete journey, based on two adults sharing one room. Not a daily rate. Hotel breakfast is generally included. Lunch and dinner are not."}</p></div>
      <div className="journey-price-convert">
        <div>
          <div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">Recommended</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">From <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>per person</span></div><p>{tier.description}</p><small>Ideal for</small><strong>{tier.idealFor}</strong><HashLink className="journey-tier-quote" href="#ask-joy-price">Quote this style</HashLink></article>)}</div>
          <p className="journey-price-shared">{sharedTierPoints.join(" · ")}.</p>
          <p className="journey-price-note">{frontmatter.priceExplanation || "Prices are a guide in USD. Final pricing depends on travel dates, group size, hotel availability and any route adjustments. Your licensed local travel partner confirms the quotation and contract before you decide."}</p>
        </div>
        <div className="journey-quote-ask"><h3>Get a quote for the style you prefer.</h3><p>{completePrice}. Pick Comfort, Premium or Luxury, then send a month and group size. Joy replies with a range for those dates — nothing is booked.</p><QuickAsk layout="embedded" id="ask-joy-price" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} intent="trip" /><p className="journey-quote-contract">Joy replies to this note.</p></div>
      </div></div></section> : <JourneyQuoteBand id="ask-joy-price" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} />}

      <section className="journey-inclusions section journey-inclusions-compact" id="details"><div className="shell journey-inclusion-grid"><div><span className="journey-detail-label">THE DETAILS</span><h2>What’s included</h2>{frontmatter.inclusions.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div><span className="journey-detail-label">GOOD TO KNOW</span><h2>What’s not included</h2>{frontmatter.exclusions.map((item) => <p key={item}><span>—</span>{item}</p>)}</div></div></section>

      <JourneyTrustSection showCredentials={false} showMuslimFriendly={false} hotelCopy={isSixDayYunnanJourney ? "Premium hotels are the standard on this price. These are examples. The hotel in each place is named in your written proposal." : undefined} />

    </section>

    <JourneyPractical notes={frontmatter.bookingNotes?.map((note) => ({ title: note.title, detail: note.detail }))} faqs={frontmatter.faqs.map((faq) => ({ title: faq.question, detail: faq.answer }))} />
    {frontmatter.bookingNotes?.length ? null : <YunnanTravelNotes />}

    {isSixDayYunnanJourney ? <JourneyQuoteBand id="ask-joy-final" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} showRouteLink /> : <section className="journey-final-cta"><div><p>LIKE THIS ROUTE, BUT WANT TO MAKE IT YOURS?</p><h2>Get this starting price quoted for your dates.</h2><span>The figure on the page is a Comfort starting point. Send a month, group size and hotel style, and Joy replies with a range — nothing is booked.</span><HashLink href="#ask-joy" className="button button-light">GET A QUOTE</HashLink><Link href={whatsapp} className="journey-final-alt">Prefer WhatsApp? Message Joy →</Link><Link href="/custom-china-tour" className="journey-final-alt" data-cta-location="journey_custom_alternative">A different date or route? Explore tailor-made Yunnan →</Link></div></section>}
    <JourneyMobileCta label={isSixDayYunnanJourney ? "CHAT ON WHATSAPP" : undefined} />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
