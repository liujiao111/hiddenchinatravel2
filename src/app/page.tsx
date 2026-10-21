import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys } from "@/lib/journeys";
import { getHomeTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Private Yunnan Tours & Tailor-Made Journeys",
  description: "Plan a private Yunnan journey through Kunming, Dali, Lijiang, Shaxi, Lugu Lake and Shangri-La, with tailor-made itineraries, private transport, local guides and personal support.",
  alternates: { canonical: "https://hiddenchinatravel.com/" },
};

const whatsapp = "https://wa.me/8618880441791?text=" + encodeURIComponent("Hi Joy, I'd like help planning a private Yunnan journey.");
const howItWorks = [
  ["01", "Share Your Ideas", "Tell us when you plan to travel, how many people are joining and what you would most like to experience."],
  ["02", "Receive a Proposed Route", "Joy will suggest a practical route based on travel times, seasonal conditions and your preferred pace."],
  ["03", "Refine and Confirm", "Adjust the itinerary, hotels and services before reviewing the final quotation and deciding whether to book."],
];
const reasons = [
  ["01", "Private by design", "Travel with your own party, private vehicle and agreed itinerary. There are no large coach groups or fixed sightseeing schedules."],
  ["02", "No shopping stops", "Your journey is designed around places, people and experiences, without mandatory shopping stops or commission-led detours."],
  ["03", "Licensed local operation", "The guides, vehicles and on-the-ground travel services described in your proposal are provided by a licensed Yunnan travel agency."],
  ["04", "Clear details before payment", "Review the proposed route, services, inclusions, exclusions and quoted price before deciding whether to confirm."],
  ["05", "First-time China friendly", "Receive practical guidance about payments, mobile data, transportation, maps and arrival preparation."],
  ["06", "Personal support", "Joy remains available before and during your journey, so questions and unexpected changes do not have to become travel-day stress."],
];
const supportItems = [
  { title: "Entry Requirements", detail: "Check visa, visa-free or transit rules for your passport and route.", href: "/survival-kit#entry" },
  { title: "Payments", detail: "Set up Alipay and a backup way to pay before you leave.", href: "/survival-kit#payment" },
  { title: "Mobile Data and Internet", detail: "Choose roaming or a travel eSIM and save the setup instructions.", href: "/survival-kit#esim" },
  { title: "Maps and Transportation", detail: "Prepare maps, trains and everyday transport before arrival.", href: "/survival-kit#maps" },
];
const destinations = [
  ["Kunming", "Yunnan’s gateway city, with the Stone Forest landscapes and time to reset after a long-haul arrival.", "/assets/resources/昆明-石林-352.jpg", "/china-destinations/yunnan", "EXPLORE KUNMING"],
  ["Dali", "Lakeside villages, Bai culture and a gentler pace beside the Cangshan Mountains and Erhai Lake.", "/assets/destinations/yunnan/dali.webp", "/dali-travel-guide", "EXPLORE DALI"],
  ["Shaxi", "A quieter Tea Horse Road town that becomes more rewarding after the daytime visitors leave.", "/assets/destinations/yunnan/shaxi.webp", "/dali-hidden-gems-off-the-beaten-path", "DISCOVER SHAXI"],
  ["Lijiang", "Historic streets, local culture and access to the landscapes around Jade Dragon Snow Mountain.", "/assets/destinations/yunnan/lijiang.webp", "/china-destinations/yunnan", "EXPLORE LIJIANG"],
  ["Lugu Lake", "Mountain roads, lakeside villages and a quieter side of northwest Yunnan.", "/assets/resources/丽江-泸沽湖-419.jpg", "/china-destinations/yunnan", "DISCOVER LUGU LAKE"],
  ["Shangri-La", "High-altitude landscapes and a distinctly different side of Yunnan.", "/assets/destinations/yunnan/shangri-la.webp", "/china-destinations/yunnan", "EXPLORE SHANGRI-LA"],
];
const faqs = [
  ["How much does a private Yunnan journey cost?", "Pricing depends on the route, number of travelers, travel dates, hotel standard and whether you require a guide throughout the journey. After learning more about your plans, we will provide a tailored quotation with the inclusions and exclusions clearly explained."],
  ["Can the itinerary be customized?", "Yes. Suggested journeys are starting points rather than fixed packages. We can adjust the number of days, pace, hotels, destinations, activities and level of guiding according to your group’s interests and requirements."],
  ["Do I need to pay before receiving a proposed route?", "No. You can begin by sharing your dates, approximate trip length, group size and interests. Payment is only discussed after you have reviewed the proposed arrangements and quotation."],
  ["Who operates the journey in Yunnan?", "The guides, drivers, vehicles and on-the-ground travel services confirmed in your proposal are provided by a licensed Yunnan travel agency. Hidden China Travel helps with trip planning, communication and traveler support before and during the journey."],
  ["What is normally included?", "Inclusions vary by journey but may include private transportation, local guides, accommodation, selected attraction tickets and trip-planning support. Your proposal will clearly state what is included and what you will need to arrange or pay for separately."],
  ["How soon will I receive a reply?", "Joy normally replies personally within 24 hours. More detailed proposals may require additional time, especially for complex routes or journeys during busy travel periods."],
];

export default function Home() {
  const journeys = getAllJourneys();
  const stories = getHomeTestimonials();
  const firstEncounter = journeys.find((journey) => journey.slug === "kunming-dali-shaxi-lijiang-6-days");
  const classic = journeys.find((journey) => journey.slug === "kunming-dali-lijiang-shangri-la-private-tour");
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return <main><SiteHeader />
    <section className="hero">
      <Image src="/home/hero.webp" alt="Snow-capped mountains in Yunnan" fill preload unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="hero-kicker">PRIVATE YUNNAN JOURNEYS</p>
        <h1>Discover Yunnan<br />at Your Own Pace</h1>
        <p className="hero-lead hero-desktop-only">Explore Dali, Lijiang and beyond through a private journey shaped around your dates, interests and preferred pace.</p>
        <p className="hero-lead hero-mobile-only">Private journeys through Dali, Lijiang and beyond, shaped around your dates, interests and pace.</p>
        <p className="hero-brand hero-desktop-only">Born in Yunnan. Shaped by experiences abroad.</p>
        <div className="hero-actions">
          <EnquireLink data-cta-location="home_hero_custom" className="button button-blue">PLAN MY YUNNAN TRIP</EnquireLink>
          <Link href="/journeys" className="button button-light hero-desktop-only">EXPLORE JOURNEYS</Link>
        </div>
        <p className="hero-trust-line hero-desktop-only">Private journeys · No shopping stops · Licensed local operator · Personal support</p>
        <p className="hero-trust-line hero-mobile-only">Private transport · Local support · No shopping stops</p>
        <small>Personal reply from Joy within 24 hours.</small>
        <Link href="/journeys" className="hero-text-link hero-mobile-only">Explore journeys →</Link>
      </div>
    </section>

    <section className="section process" id="how-it-works">
      <div className="narrow">
        <p className="kicker">HOW IT WORKS</p>
        <h2>Planning Your Yunnan Journey Is Simple</h2>
        <p>You do not need a finished itinerary. Share your dates, group size and travel interests, and Joy will help turn your ideas into a practical private journey.</p>
      </div>
      <div className="shell">
        <div className="process-grid">{howItWorks.map(([number, title, text]) => <div key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></div>)}</div>
        <div className="center">
          <EnquireLink data-cta-location="home_how_it_works" className="button button-blue">PLAN MY YUNNAN TRIP</EnquireLink>
          <p className="home-helper">No payment is required to start planning.</p>
        </div>
      </div>
    </section>

    <section className="section section-sand home-journeys" id="journeys">
      <div className="shell">
        <div className="section-heading">
          <p className="kicker">FEATURED PRIVATE JOURNEYS</p>
          <h2>A Thoughtful Starting Point for Your Yunnan Trip</h2>
          <p>Choose one of our suggested journeys or use it as inspiration for a route designed around you. Every private journey can be adjusted to suit your dates, group and preferred pace.</p>
        </div>
        <div className="journeys-card-grid home-journeys-grid">
          {firstEncounter ? <JourneyCard priority journey={{
            title: "First Encounter Yunnan",
            subtitle: "Kunming • Dali • Lijiang • Shaxi",
            href: `/journeys/${firstEncounter.slug}`,
            image: firstEncounter.frontmatter.coverImage,
            imageAlt: firstEncounter.frontmatter.coverAlt || firstEncounter.frontmatter.title,
            duration: "6 Days / 5 Nights Private Journey",
            fromPrice: `From ${formatPriceLabel(firstEncounter.frontmatter.fromPrice, firstEncounter.frontmatter.currency)} ${firstEncounter.frontmatter.priceBasis}`,
            features: ["Private vehicle", "English-speaking guide", "Handpicked hotels", "No shopping stops"],
            ctaLabel: "View this journey →",
            trackingLocation: "home_featured_first_encounter",
          }} /> : null}
          {classic ? <JourneyCard journey={{
            title: "The Essence of Yunnan",
            subtitle: "Erhai Lake • Jade Dragon Snow Mountain • Tiger Leaping Gorge",
            href: `/journeys/${classic.slug}`,
            image: classic.frontmatter.coverImage,
            imageAlt: classic.frontmatter.coverAlt || classic.frontmatter.title,
            duration: "8 Days / 7 Nights Private Journey",
            fromPrice: `From ${formatPriceLabel(classic.frontmatter.fromPrice, classic.frontmatter.currency)} ${classic.frontmatter.priceBasis}`,
            features: ["Private driver-guide", "Handpicked hotels", "Full-trip travel insurance", "No shopping stops"],
            ctaLabel: "View this journey →",
            trackingLocation: "home_featured_classic",
          }} /> : null}
          <JourneyCard journey={{
            title: "Tailor-Made Yunnan",
            subtitle: "Private Journey Designed Around You",
            href: "/custom-china-tour",
            image: "/home/local-support.webp",
            imageAlt: "A wooden boat on a highland lake in Yunnan",
            destination: "Designed around your dates, interests and pace",
            features: ["Couples, families and friends", "Driver-only or guided options", "Slower routes with fewer hotel changes", "First-time China travel support"],
            ctaLabel: "Design my Yunnan journey →",
            trackingLocation: "home_featured_custom",
          }} />
        </div>
        <p className="home-helper">A travel month, number of days and approximate group size are enough to begin.</p>
      </div>
    </section>

    <section className="section why" id="why-us">
      <div className="shell">
        <div className="section-heading light">
          <p className="kicker">WHY HIDDEN CHINA TRAVEL</p>
          <h2>Local Knowledge, Seen From Both Sides</h2>
          <p>Hidden China Travel combines firsthand knowledge of Yunnan with an understanding of the questions international travelers often have before visiting China.</p>
        </div>
        <div className="reason-grid reason-grid-six">{reasons.map(([number, title, text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <Testimonials
      items={stories}
      eyebrow="TRAVELER STORIES"
      heading="What Travelers Remember"
      intro="Words from guests who explored Yunnan with Joy and our licensed local travel partners."
      showRating={false}
      note="Some guest names have been shortened for privacy. Reviews translated from another language have been lightly edited for clarity without changing their meaning."
    />

    <section className="about-feature reverse home-founder" id="joy">
      <div className="about-feature-image">
        <Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" />
      </div>
      <div className="about-feature-copy">
        <p className="kicker">MEET YOUR TRAVEL PLANNER</p>
        <h2>Born in Yunnan. Shaped by Experiences Abroad.</h2>
        <p>I grew up in Yunnan and later lived in Japan and the Philippines.</p>
        <p>Living abroad meant becoming the foreign visitor myself. Everyday tasks that local people take for granted, such as making payments, using transportation or understanding unfamiliar systems, suddenly required more preparation and trusted local context.</p>
        <p>That experience changed the way I think about travel.</p>
        <p>I created Hidden China Travel to help international visitors experience Yunnan with fewer uncertainties, more personal support and enough time to appreciate the places between the famous landmarks.</p>
        <p>I help shape the route before your journey, while licensed local partners provide the guides, drivers and travel services confirmed in your proposal.</p>
        <p className="home-signature"><b>Joy Liu</b><span>Founder and Yunnan Travel Planner</span></p>
        <Link href="/about-us">Read Joy’s story →</Link>
        <Link href="/contact">Ask Joy a question →</Link>
      </div>
    </section>

    <section className="yunnan-prepare section" id="guides">
      <div className="shell">
        <div className="yunnan-section-heading light">
          <span>FIRST-TIME CHINA SUPPORT</span>
          <h2>We Help With More Than the Itinerary</h2>
          <p>Payments, mobile data, maps, transportation and attraction bookings can work differently in China. Our practical travel guides help you prepare before departure, while guests booking a private journey receive relevant preparation advice for their route.</p>
        </div>
        <div className="yunnan-practical-grid">{supportItems.map((item, index) => <Link href={item.href} key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.detail}</p><b>GET READY →</b></Link>)}</div>
        <div className="center"><Link href="/survival-kit" className="button button-light">OPEN THE CHINA PRE-DEPARTURE CHECKLIST →</Link></div>
      </div>
    </section>

    <section className="section destinations-section" id="destinations">
      <div className="shell">
        <div className="section-heading">
          <p className="kicker">EXPLORE YUNNAN</p>
          <h2>Find the Places That Fit Your Journey</h2>
          <p>Yunnan is more than one route. Begin with the places we know best, then combine them in a way that suits your time and interests.</p>
          <Link className="section-heading-link" href="/china-destinations/yunnan">Open the complete Yunnan travel guide →</Link>
        </div>
        <div className="destination-grid home-destination-grid">{destinations.map(([name, note, image, href, cta]) => <article className="image-card" key={name}><Image src={image} alt={name} fill sizes="(max-width: 700px) 100vw, 33vw" /><div className="card-shade" /><div className="image-card-copy"><p>{note}</p><h3>{name}</h3><Link href={href} className="button button-light">{cta}</Link></div></article>)}</div>
      </div>
    </section>

    <section className="journey-faq section" id="questions">
      <div className="narrow">
        <div className="section-heading">
          <p className="kicker">BEFORE YOU START</p>
          <h2>Frequently Asked Questions</h2>
        </div>
        {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
      </div>
    </section>

    <section className="cta-band final-cta" id="plan">
      <Image src="/home/plan-journey.webp" alt="Turquoise lake and snow mountains in Yunnan" fill unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div>
        <h2>Ready to Start Planning Yunnan?</h2>
        <p>You do not need a finished itinerary. Tell us your travel dates or approximate month, number of travelers and the places or experiences that interest you. Joy will help turn those ideas into a practical private journey.</p>
        <div className="hero-actions">
          <EnquireLink data-cta-location="home_final_custom" className="button button-blue">PLAN MY YUNNAN TRIP</EnquireLink>
          <Link href={whatsapp} data-cta-location="home_final_whatsapp" className="button button-light">CHAT WITH JOY ON WHATSAPP</Link>
        </div>
        <p className="final-cta-trust">Personal reply from Joy · No payment required to start planning · Your journey can be adjusted before confirmation</p>
      </div>
    </section>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
  </main>;
}
