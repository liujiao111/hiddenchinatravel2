import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { CustomJourneyForm } from "@/components/custom-journey-form";
import { JourneyCard } from "@/components/journey-card";
import { JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { SiteHeader } from "@/components/site-header";
import { getAllJourneys } from "@/lib/journeys";

const canonical = "https://hiddenchinatravel.com/custom-china-tour";
const whatsapp = "https://wa.me/8618880441791?text=" + encodeURIComponent("Hi Joy, I'd like a tailor-made private journey, starting with Yunnan. Can we discuss my ideas?");
const experiences = [
  { title: "Choose the places that draw you in", image: "/assets/blog/yunnan-travel-from-australia/cover-lijiang-rooftops.webp", alt: "Traditional rooftops in Lijiang Old Town", text: "Stay longer in a place you love, add a new stop, or leave a busy attraction out. We’ll help the route make sense." },
  { title: "Leave room to slow down", image: "/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", alt: "Erhai Lake and the Cangshan mountains near Dali", text: "Later starts, fewer hotel changes, a quiet afternoon by the lake. Your days can have space in them." },
  { title: "Travel with your own people", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp", alt: "A stone-paved lane in Shaxi", text: "Bring your partner, family or friends. Tell us about your party so we can discuss walking, driving and room arrangements." },
  { title: "Make time for what matters to you", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-theater-courtyard.webp", alt: "The traditional theater courtyard in Shaxi", text: "Markets and local food, photography, village walks or tea culture. We’ll look for experiences that fit your interests and dates." },
];
const ideas = [
  { title: "A gentler family journey", route: "Dali · Shaxi · Lijiang", text: "Fewer hotel changes, time for crafts and markets, and shorter activity days. Share your children’s ages or the needs of older relatives so we can discuss a suitable pace." },
  { title: "Landscapes through your lens", route: "Dali · Lijiang · Shangri-La", text: "More time for photography and scenery, with room to adjust around light and weather. We’ll discuss driving distances, mountain access and altitude before suggesting the route." },
  { title: "Tea, food and everyday Yunnan", route: "Kunming · Pu’er · Xishuangbanna", text: "An idea for travelers drawn to tea culture, local food and a warmer side of Yunnan. The visits and guiding arrangements depend on season and availability." },
];
const steps = [
  ["01", "Share your ideas", "Send your dates, party size and the things you would love to do. Uncertain plans are welcome."],
  ["02", "Shape a route", "Joy reviews your ideas and discusses a realistic route, pace and level of comfort with you."],
  ["03", "Refine the proposal", "Review the itinerary and itemized quote. We’ll discuss what to add, adjust or leave out."],
  ["04", "Confirm and travel", "Your licensed local partner confirms the arrangements, handles the contract and operates the trip."],
];
const faqs = [
  { question: "Can I start from one of your existing itineraries?", answer: "Yes. Tell us which journey caught your eye and what you would change. We can discuss a different duration, extra stops, hotel preferences or a gentler pace rather than starting from a blank page." },
  { question: "Do I need to know my dates and budget already?", answer: "No. A month, a rough trip length or a few places you like is enough to start. We will clarify dates, party size and priorities before preparing a meaningful quote." },
  { question: "Do you plan trips beyond Yunnan?", answer: "Yunnan is our starting point and the region we know best. If your plans include other parts of China, tell us where you would like to go. We will discuss feasibility and partner availability before promising arrangements." },
  { question: "How is a custom private journey priced?", answer: "The quote depends on your dates, route, party size, accommodation, transport, guide language and chosen activities. It will state the currency, inclusions, exclusions and payment terms before you decide. Budget ranges in the form are planning preferences, not advertised tour prices." },
  { question: "Is this a group tour?", answer: "The journey is planned for your own party, rather than joining a scheduled coach group. Public attractions, restaurants or activities may still be shared with other visitors; your proposal will clarify any shared arrangements." },
  { question: "Can you accommodate family, dietary or accessibility needs?", answer: "Please describe what matters to you in the form. We will check the relevant hotel, vehicle, food and activity arrangements with the local partner before confirming whether they can meet your needs." },
  { question: "Who handles the booking, contract and payment?", answer: "Joy helps shape the route and coordinates the proposal. The licensed local travel partner confirms the services, handles the travel contract and payment, and operates the journey. These details will be clear in your written proposal." },
  { question: "Does submitting this form commit me to a booking?", answer: "No. It starts a conversation about your plans. You can review the proposal and terms before deciding whether to proceed." },
];

export const metadata: Metadata = {
  title: "Tailor-Made China Tours & Private Yunnan Journeys",
  description: "Design a private China journey around your dates, interests and pace. Start with local knowledge in Yunnan and request a personalized itinerary and quote from Joy Liu.",
  alternates: { canonical },
  openGraph: { title: "Your China journey, designed around you", description: "A private route shaped around your people, pace and interests. Start with Yunnan.", url: canonical, images: [{ url: "https://hiddenchinatravel.com/home/hero.webp" }], type: "website" },
};

export default function CustomChinaTourPage() {
  const journeys = getAllJourneys();
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: "Tailor-made private journey planning", url: canonical, description: metadata.description, areaServed: { "@type": "Place", name: "Yunnan, China" }, provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" } },
    { "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
  return <main className="custom-journey-page">
    <SiteHeader />
    <JourneyHero title="Your China journey, designed around you." image="/home/hero.webp" imageAlt="Mountains and countryside in Yunnan" eyebrow="TAILOR-MADE PRIVATE TRAVEL" description="Different dates. A different pace. A place you’ve always wanted to see. Tell us what you have in mind, and we’ll shape a private journey around you — starting with Yunnan." primary={{ href: "#plan", label: "START PLANNING MY TRIP" }} secondary={{ href: "#possibilities", label: "EXPLORE THE POSSIBILITIES" }} note="Your own party. Your preferred pace. A proposal before you decide." />
    <JourneySectionNav links={[{ href: "#possibilities", label: "Make it yours" }, { href: "#ideas", label: "Journey ideas" }, { href: "#process", label: "How it works" }, { href: "#quote", label: "Your proposal" }, { href: "#questions", label: "Useful details" }]} action={{ href: "#plan", label: "Start planning" }} />
    <JourneyOverview title="Start with your plans, not a package." description="Our existing routes are a starting point. If they don’t fit your trip, we can discuss a journey designed from the ground up." items={[{ label: "WHERE", value: "Yunnan first · Other China destinations by request" }, { label: "HOW YOU TRAVEL", value: "A private party · Dates and duration shaped around you" }, { label: "YOUR QUOTE", value: "Prepared around your route, dates and preferences" }]} action={{ href: "#plan", label: "TELL US WHAT YOU HAVE IN MIND" }} />
    <section className="journey-manifesto" id="possibilities"><div className="shell journey-manifesto-grid"><div className="journey-manifesto-copy"><h2><span>A journey that feels</span> <em>like yours.</em></h2><i aria-hidden="true" /><p>A quiet morning rather than another early start. More time with a place, less time moving between hotels. The freedom to follow what interests you.</p><strong>We begin by listening.</strong></div></div></section>
    <section className="journey-experiences section section-sand"><div className="shell"><div className="journey-editorial-heading"><h2>What would make this your kind of trip?</h2><p>We’ll help you balance the places you want to see with the way you want to spend your days.</p></div><div className="journey-experience-grid">{experiences.map(item => <article key={item.title}><div><Image src={item.image} alt={item.alt} fill unoptimized sizes="(max-width:700px) 100vw, 50vw" /></div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
    <section className="journey-itinerary section" id="ideas"><div className="shell journey-section-layout"><header><h2>A few ways your journey could take shape.</h2><span>A little inspiration to get you started. We’ll adapt these route ideas and experiences around your plans.</span></header><div className="journey-days">{ideas.map((idea, index) => <details key={idea.title} open={index === 0}><summary><span>0{index + 1}</span><div><h3>{idea.title}</h3><p>{idea.route}</p></div><b aria-hidden="true">+</b></summary><p>{idea.text}</p></details>)}</div></div></section>
    <section className="journey-mid-cta"><div className="shell"><div><h2>Already have an itinerary in mind?</h2><p>Tell us what you would keep, add or change.</p></div><div><Link href="#plan" className="button button-light">MAKE MY JOURNEY PERSONAL</Link><span>You can include an existing route in your enquiry.</span></div></div></section>
    <section className="journey-support section journey-support-flow custom-planning-flow" id="process"><div className="shell journey-section-layout"><header><h2>From a first idea to a journey you can look forward to.</h2><span>You’ll speak with Joy as we shape the plan. A licensed local partner confirms and operates the arrangements.</span></header><div className="journey-support-grid">{steps.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill unoptimized sizes="(max-width:800px) 100vw, 48vw" /></div><div className="journey-host-copy"><span>YOUR LOCAL CONNECTION</span><h2>You’ll be planning with Joy.</h2><blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote><p>Joy Liu was born and raised in Yunnan. He helps you consider the route, pace and practical details, then works with licensed local partners to confirm what can be arranged.</p><Link href="/about-us">MEET JOY →</Link></div></section>
    <section className="journey-pricing section section-sand" id="quote"><div className="shell"><div className="journey-editorial-heading"><h2>A clear proposal before you decide.</h2><p>Your dates, route and party shape the price. We’ll discuss your budget and priorities before putting the details in writing.</p></div><div className="custom-proposal-grid">{[["Your route", "Stops, travel times, daily pace and activities."],["Your arrangements", "Hotel and room choices, private transport and guide language."],["Your quote", "The total, currency, inclusions, exclusions and optional extras."],["Your booking terms", "The licensed operator, payment schedule and cancellation terms."]].map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section custom-planner-section" id="plan"><div className="shell contact-form-layout"><header><h2>Tell us what you have in mind.</h2><p>Start with the parts you know. We can help you work out the rest.</p><p>Yunnan is where we begin. If you’re considering other parts of China, add them below and we’ll discuss what is possible.</p><div className="custom-planner-contact"><p>Prefer a conversation?</p><Link href={whatsapp} data-cta-location="custom_journey_form_backup">Chat with Joy on WhatsApp →</Link><a href="mailto:joy.liu@hiddenchinatravel.com">joy.liu@hiddenchinatravel.com</a></div></header><CustomJourneyForm /></div></section>
    <section className="journeys-list section section-sand"><div className="shell"><div className="journey-editorial-heading"><h2>Or start with a route you already like.</h2><p>Use one of these private journeys as the foundation, then tell us what you would change.</p></div><div className="journeys-card-grid custom-ready-journeys">{journeys.map(journey => <JourneyCard key={journey.slug} journey={{ title: journey.frontmatter.shortTitle, subtitle: journey.frontmatter.excerpt, href: `/journeys/${journey.slug}`, image: journey.frontmatter.coverImage, duration: journey.frontmatter.duration, ctaLabel: "Explore this starting point →", trackingLocation: "custom_journey_ready_route" }} />)}</div></div></section>
    <section className="journey-faq section" id="questions"><div className="narrow"><div className="section-heading"><h2>Useful details, before you start.</h2></div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>Your plans don’t have to fit a six-day itinerary.</h2><span>Tell us where you’d like to go and how you like to travel. We’ll take it from there.</span><Link href="#plan" className="button button-light">START PLANNING MY TRIP</Link></div></section>
    <Link href="#plan" className="journey-mobile-cta">START PLANNING <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
