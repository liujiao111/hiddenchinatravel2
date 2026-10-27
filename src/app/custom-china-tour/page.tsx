import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookingTerms } from "@/components/booking-terms";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { MuslimFriendly } from "@/components/muslim-friendly";
import { Testimonials } from "@/components/testimonials";
import { ContentFooter } from "@/components/content-footer";
import { JourneyInspirationProvider } from "@/components/journey-inspiration-context";
import { YunnanInspiration } from "@/components/yunnan-inspiration";
import { CustomJourneyForm } from "@/components/custom-journey-form";
import { JourneyCard } from "@/components/journey-card";
import { JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { SiteHeader } from "@/components/site-header";
import { bookingFaq, bookingSteps, brandIdentity, operatorFaq } from "@/lib/booking-terms";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys } from "@/lib/journeys";
import { siteConfig } from "@/lib/site-config";
import { getSelectedTestimonials, selectedTestimonialsCopy } from "@/lib/testimonials";

const canonical = "https://hiddenchinatravel.com/custom-china-tour";
const title = "Tailor-Made Private Yunnan Tours";
const description = "Plan a custom private Yunnan itinerary around your dates, interests and pace with Joy Liu. No booking commitment until you review the written proposal.";
const whatsapp = "https://wa.me/8618880441791?text=" + encodeURIComponent("Hi Joy, I'd like a tailor-made private journey, starting with Yunnan. Can we discuss my ideas?");
const ideas = [
  { title: "A gentler family journey", route: "Dali · Shaxi · Lijiang", text: "Fewer hotel changes, time for crafts and markets, and shorter activity days. Share your children’s ages or the needs of older relatives so we can discuss a suitable pace." },
  { title: "Landscapes through your lens", route: "Dali · Lijiang · Shangri-La", text: "More time for photography and scenery, with room to adjust around light and weather. We’ll discuss driving distances, mountain access and altitude before suggesting the route." },
  { title: "Tea, food and everyday Yunnan", route: "Kunming · Pu’er · Xishuangbanna", text: "An idea for travelers drawn to tea culture, local food and a warmer side of Yunnan. The visits and guiding arrangements depend on season and availability." },
];
const faqs = [
  { question: "Can I start from one of your existing itineraries?", answer: "Yes. Tell us which journey caught your eye and what you would change. We can discuss a different duration, extra stops, hotel preferences or a gentler pace rather than starting from a blank page." },
  { question: "Do I need to know my dates and budget already?", answer: "No. A month, a rough trip length or a few places you like is enough to start. We will clarify dates, party size and priorities before preparing a meaningful quote." },
  { question: "Do you plan trips beyond Yunnan?", answer: "Yunnan is our starting point and the region we know best. If your plans include other parts of China, tell us where you would like to go. We will discuss what we can arrange before promising it." },
  { question: "How is a custom private journey priced?", answer: "The quote depends on your dates, route, party size, accommodation, transport, guide language and chosen activities. It will state the currency, inclusions, exclusions and payment terms before you decide. Budget ranges in the form are planning preferences, not advertised tour prices." },
  { question: "Is this a group tour?", answer: "The journey is planned for your own party, rather than joining a scheduled coach group. Public attractions, restaurants or activities may still be shared with other visitors; your proposal will clarify any shared arrangements." },
  { question: "Can you accommodate family, dietary or accessibility needs?", answer: "Please describe what matters to you in the form. We will check the relevant hotel, vehicle, food and activity arrangements before confirming whether they can be met." },
  { question: "Can you arrange a Muslim-friendly journey?", answer: "Yes. Muslim-friendly arrangements are a standard feature on every private journey, including tailor-made routes. Tell Joy at enquiry. Hotel breakfast is generally included and you can choose suitable items or skip it. When lunch or dinner is in the quote, we arrange a halal restaurant or packed meal, or refund that meal if we cannot confirm a suitable option. When those meals are not in the quote, the driver-guide helps you find a restaurant or takeaway. Prayer-time reminders and a quiet place or mosque can be arranged when the route allows. We do not claim certified-halal hotel kitchens." },
  operatorFaq,
  bookingFaq,
  { question: "Does submitting this form commit me to a booking?", answer: "No. It starts a conversation about your plans. You can review the proposal and terms before deciding whether to proceed." },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, images: [{ url: "https://hiddenchinatravel.com/home/hero.webp", alt: "Mountains and countryside in Yunnan" }], type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["https://hiddenchinatravel.com/home/hero.webp"] },
};

export default function CustomChinaTourPage() {
  const journeys = getAllJourneys();
  const stories = getSelectedTestimonials();
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: "Tailor-Made Yunnan", url: canonical, description: metadata.description, areaServed: { "@type": "Place", name: "Yunnan, China" }, provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" } },
    { "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
  return <JourneyInspirationProvider><main className="custom-journey-page">
    <SiteHeader />
    <JourneyHero title="Tailor-Made Yunnan" image="/home/hero.webp" imageAlt="Mountains and countryside in Yunnan" eyebrow="TAILOR-MADE YUNNAN" description="Private Journey Designed Around You" primary={{ href: "#plan", label: "Start Planning Your Journey" }} secondary={{ href: "#possibilities", label: "EXPLORE THE POSSIBILITIES" }} note={`Plan directly with Joy. ${siteConfig.replyTime} No booking commitment.`} />
    <JourneySectionNav links={[{ href: "#possibilities", label: "Make it yours" }, { href: "#muslim-friendly", label: "Muslim-friendly" }, { href: "#places", label: "Places & ideas" }, { href: "#process", label: "How it works" }, ...(stories.length > 0 ? [{ href: "#stories", label: "Stories" }] : []), { href: "#local-team", label: "Guide, vehicle & hotels" }, { href: "#quote", label: "Your proposal" }, { href: "#booking-terms", label: "Booking & payment" }, { href: "#questions", label: "Useful details" }]} action={{ href: "#plan", label: "Start planning" }} />
    <JourneyOverview title="Start with your plans, not a package." description="Our existing routes are a starting point. If they don’t fit your trip, we can discuss a journey designed from the ground up." items={[{ label: "WHERE", value: "Yunnan first · Other China destinations by request" }, { label: "HOW YOU TRAVEL", value: "A private party · Dates and duration shaped around you" }, { label: "YOUR QUOTE", value: "Prepared around your route, dates and preferences" }]} action={{ href: "#plan", label: "TELL US WHAT YOU HAVE IN MIND" }} />
    <MuslimFriendly />
    <section className="journey-manifesto" id="possibilities"><div className="shell journey-manifesto-grid"><div className="journey-manifesto-copy"><h2><span>A journey that feels</span> <em>like yours.</em></h2><i aria-hidden="true" /><p>A quiet morning rather than another early start. More time with a place, less time moving between hotels. The freedom to follow what interests you.</p><strong>We begin by listening.</strong></div></div></section>
    <section className="section section-sand custom-travel-preferences"><div className="narrow journey-editorial-heading"><h2>What would make this your kind of trip?</h2><p>Later starts, fewer hotel changes, time for markets or photography. Tell us what matters to your party, and we’ll shape the days around it.</p></div></section>
    <YunnanInspiration selectable />
    <section className="journey-itinerary section" id="ideas"><div className="shell journey-section-layout"><header><h2>A few ways your journey could take shape.</h2><span>A little inspiration to get you started. We’ll adapt these route ideas and experiences around your plans.</span></header><div className="journey-days">{ideas.map((idea, index) => <details key={idea.title} open={index === 0}><summary><span>0{index + 1}</span><div><h3>{idea.title}</h3><p>{idea.route}</p></div><b aria-hidden="true">+</b></summary><p>{idea.text}</p></details>)}</div></div></section>
    <section className="journey-mid-cta"><div className="shell"><div><h2>Already have an itinerary in mind?</h2><p>Tell us what you would keep, add or change.</p></div><div><Link href="#plan" className="button button-light">Start Planning Your Journey</Link><span>You can include an existing route in your enquiry.</span></div></div></section>
    <section className="journey-support section journey-support-flow custom-planning-flow" id="process"><div className="shell journey-section-layout"><header><h2>From a first idea to a journey you can look forward to.</h2><span>{brandIdentity.short} {brandIdentity.consultant}</span></header><div className="journey-support-grid">{bookingSteps.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    {stories.length > 0 ? <Testimonials items={stories} eyebrow={selectedTestimonialsCopy.eyebrow} heading={selectedTestimonialsCopy.heading} intro={selectedTestimonialsCopy.intro} note={selectedTestimonialsCopy.note} /> : null}
    <JourneyTrustSection variant="compact" />
    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, travel consultant at Hidden China Travel" fill unoptimized sizes="(max-width:800px) 100vw, 48vw" /></div><div className="journey-host-copy"><span>YOUR LOCAL CONNECTION</span><h2>You’ll be planning with Joy.</h2><blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote><p>Joy Liu was born and raised in Yunnan. {brandIdentity.consultant}</p><Link href="/about-us">MEET JOY →</Link></div></section>
    <section className="journey-pricing section section-sand" id="quote"><div className="shell"><div className="journey-editorial-heading"><h2>A clear proposal before you decide.</h2><p>Your dates, route and party shape the price. We’ll discuss your budget and priorities before putting the details in writing.</p></div><div className="custom-proposal-grid">{[["Your route", "Stops, travel times, daily pace and activities."],["Your arrangements", "Hotel and room choices, private transport and a driver-guide throughout."],["Your quote", "The total, currency, inclusions, exclusions and optional extras."],["Your booking terms", "Contract with the licensed agency, 20% deposit, then the balance after your first pickup."]].map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <BookingTerms heading="The same booking terms as our other journeys." intro="Confirm the written itinerary and travel contract, pay a 20% deposit, then settle the balance after your first pickup." />
    <section className="section custom-planner-section" id="plan"><div className="shell contact-form-layout"><header><h2>Tell us what you have in mind.</h2><p>A few details are enough to start. Joy replies by email to discuss your route before preparing an itinerary and quote. {siteConfig.replyTime}</p><p>Want a sense of how a private Yunnan route can look? After you send the form you can download a sample itinerary. It is an example, not a package you have to follow. First Encounter Yunnan and The Essence of Yunnan are starting points if you already like one of those shapes.</p><p>Yunnan is where we begin. If you’re considering other parts of China, add them below and we’ll discuss what is possible. Lugu Lake and other routes that are not listed as ready-made journeys can be designed here.</p><div className="custom-planner-contact"><p>Prefer a conversation?</p><Link href={whatsapp} data-cta-location="custom_journey_form_backup">Chat with Joy on WhatsApp →</Link><a href="mailto:joy.liu@hiddenchinatravel.com">joy.liu@hiddenchinatravel.com</a></div></header><CustomJourneyForm /></div></section>
    <section className="journeys-list section section-sand"><div className="shell"><div className="journey-editorial-heading"><h2>Or start with a route you already like.</h2><p>Use one of these private journeys as the foundation, then tell us what you would change.</p></div><div className="journeys-card-grid custom-ready-journeys">{journeys.map(journey => <JourneyCard key={journey.slug} journey={{ title: journey.frontmatter.shortTitle, subtitle: journey.frontmatter.excerpt, href: `/journeys/${journey.slug}`, image: journey.frontmatter.coverImage, duration: journey.frontmatter.duration, fromPrice: journey.frontmatter.fromPrice > 0 ? `From ${formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency)} ${journey.frontmatter.priceBasis}` : "Tailored quote for your dates", ctaLabel: "Explore this starting point →", trackingLocation: "custom_journey_ready_route" }} />)}</div></div></section>
    <section className="journey-faq section" id="questions"><div className="narrow"><div className="section-heading"><h2>Useful details, before you start.</h2></div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>Your plans don’t have to fit a set itinerary.</h2><span>A family trip, a slower pace, or more time in a place you love. Let’s shape your Yunnan journey around it.</span><Link href="#plan" className="button button-light">Start Planning Your Journey</Link></div></section>
    <Link href="#plan" className="journey-mobile-cta">Start Planning Your Journey <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main></JourneyInspirationProvider>;
}
