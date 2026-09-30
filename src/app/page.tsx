import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GuidesExplorer } from "@/components/guides-explorer";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { getAllJourneys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Yunnan Private Tours & China Travel Guides | Hidden China Travel",
  description: "Discover private Yunnan journeys, practical China travel guides, local support, and personalized help for first-time visitors to China.",
};

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20first%20journey%20through%20Yunnan";
const reasons = [
  ["01", "Private journeys", "Travel with your own party, at a pace that fits you—not a large coach group or fixed sightseeing schedule."],
  ["02", "No shopping stops", "Journeys are built around places, people and experiences, never mandatory shopping or commission-led detours."],
  ["03", "Licensed local partners", "Local travel partners provide the guides, drivers and on-the-ground services confirmed in your proposal."],
  ["04", "First-time China friendly", "We include the practical details that help an unfamiliar first trip feel much easier."],
  ["05", "Local support", "Questions and unexpected changes do not have to become travel-day stress."],
];
const preparationStages = [
  { number: "01", title: "Check your entry and route", detail: "Confirm the rules for your passport, then choose a route that fits your time.", href: "/survival-kit#decide" },
  { number: "02", title: "Book the essentials", detail: "Sort your first hotel, trains and any sights that need advance tickets.", href: "/survival-kit#book" },
  { number: "03", title: "Set up your phone", detail: "Get mobile data, decide on a VPN, and prepare payments and maps.", href: "/survival-kit#setup" },
];
const destinations = [
  ["Dali", "Lakeside villages, Bai culture and enough time to experience the place beyond its checklist.", "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", "/dali-travel-guide"],
  ["Shaxi", "A quieter Tea Horse Road town that rewards travelers who stay after the day visitors leave.", "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", "/dali-hidden-gems-off-the-beaten-path"],
  ["Private Yunnan Journey", "Dali, Lijiang and two nights at Lugu Lake in a private six-day journey.", "/assets/resources/丽江-泸沽湖-419.jpg", "/journeys/dali-lijiang-lugu-lake-private-tour"],
];

export default function Home() {
  const journeys = getAllJourneys();
  const featuredJourney = journeys.find((journey) => journey.slug === "dali-lijiang-lugu-lake-private-tour") ?? journeys[0];
  const journeyHref = `/journeys/${featuredJourney.slug}`;
  const journeyFacts = [featuredJourney.frontmatter.duration, featuredJourney.frontmatter.route, "Private vehicle & guide", "Five hotel nights"];
  const journeyHighlights = featuredJourney.frontmatter.experiences.slice(0, 4).map((experience) => experience.title);

  return <main><SiteHeader />
    <section className="hero"><Image src="/home/hero.webp" alt="Snow-capped mountains in Yunnan" fill preload unoptimized sizes="100vw" /><div className="hero-shade" /><div className="hero-copy"><h1>China, at Your Pace.</h1><p>Discover a more personal side of China through journeys shaped by local knowledge, slower travel, and meaningful experiences.<span>Born in Yunnan, Shaped by experiences abroad.</span></p><div className="hero-actions"><Link href="/journeys" className="button button-light">EXPLORE JOURNEYS</Link><Link href={whatsapp} className="button button-blue">CHAT JOY ON WHATSAPP</Link></div></div></section>
    <section className="hero-bridge"><div className="narrow"><h2>A more personal way to experience China</h2><p>Choose a thoughtfully designed private journey or ask Joy to shape one around your dates, interests and preferred pace. Trusted local people make the unfamiliar parts easier.</p></div></section>

    <section className="about-feature home-featured" id="journeys"><div className="about-feature-image"><Image src={featuredJourney.frontmatter.coverImage} alt="Lugu Lake in western Yunnan" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><h2>Featured Yunnan journey</h2><h3 className="feature-name">{featuredJourney.frontmatter.title}</h3><p>Travel from Dali&apos;s lakeside villages through Lijiang to two nights beside Lugu Lake, with a private vehicle and local guide throughout.</p><div className="journey-facts">{journeyFacts.map((fact) => <span key={fact}>{fact}</span>)}</div><ul className="highlight-list">{journeyHighlights.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><p className="journey-price">Tailored quote for your dates and group</p><Link href={journeyHref}>Explore this journey →</Link></div></section>

    <section className="story section-sand"><div className="shell story-grid"><div><h2>Why Hidden China Travel exists</h2></div><blockquote>“Most travelers remember the places they visited. We want you to remember how those places felt.”<cite>Our point of view</cite></blockquote><div className="story-note"><b>Local knowledge, seen from both sides.</b><p>Hidden China Travel combines Joy&apos;s Yunnan roots with his experience of living abroad and becoming the foreign visitor himself.</p><Link href="/about-us">Read our story →</Link></div></div></section>

    <section className="about-feature reverse home-founder"><div className="about-feature-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><h2>Meet Joy Liu</h2><h3 className="feature-name">Born in Yunnan. Shaped by experiences abroad.</h3><p>Raised in Yunnan, Joy later lived in Japan and the Philippines. Being the foreigner taught him how much trusted local context can change a journey.</p><p>He created Hidden China Travel to make China feel a little less intimidating—and a lot more personal.</p><Link href="/about-us">About Joy →</Link></div></section>

    <section className="section why" id="why-us"><div className="shell"><div className="section-heading light"><h2>Why travel with us?</h2></div><div className="reason-grid reason-grid-five">{reasons.map(([number,title,text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section home-preparation" id="guides"><div className="shell"><header className="home-preparation-heading"><h2>Prepare for China, all in one place.</h2><p>From entry rules and bookings to mobile data, payments and maps, our trip checklist helps you work through the practical steps in a useful order.</p></header><div className="home-preparation-steps"><svg className="home-preparation-line" viewBox="0 0 1200 125" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 35 C100 105 125 105 200 95 C350 95 430 25 600 45 C770 65 830 115 1000 95 C1100 85 1130 70 1200 70" /><circle cx="200" cy="95" r="9" /><circle cx="600" cy="45" r="9" /><circle cx="1000" cy="95" r="9" /></svg>{preparationStages.map((stage) => <Link href={stage.href} key={stage.number} className="home-preparation-step"><span className="home-preparation-dot" aria-hidden="true" /><span className="sr-only">Step {stage.number}: </span><h3>{stage.title}</h3><p>{stage.detail}</p><span className="home-preparation-step-link">EXPLORE THIS STEP →</span></Link>)}</div><Link href="/survival-kit" className="button button-green home-preparation-cta">OPEN THE CHINA TRIP CHECKLIST →</Link></div></section>

    <section className="section guides-section"><div className="shell"><div className="section-heading"><h2>Explore a topic in more detail</h2><p>Use these guides when you want a closer look at one part of your China trip.</p></div><GuidesExplorer /></div></section>

    <section className="cta-band mid-cta"><Image src="/home/local-support.webp" alt="A wooden boat on a highland lake in Yunnan" fill unoptimized sizes="100vw" /><div className="hero-shade" /><div><h2>Private travel, personal support</h2><p>Start with your dates and rough route. Joy can help shape a complete private journey around how you want to experience Yunnan.</p><Link href={whatsapp} className="button button-blue">ASK JOY</Link></div></section>

    <section className="section destinations-section" id="destinations"><div className="shell"><div className="section-heading"><h2>Explore Yunnan</h2><p>Begin with the places and journey we know best, supported by real guides and local context.</p><Link className="section-heading-link" href="/china-destinations/yunnan">Open the complete Yunnan travel guide →</Link></div><div className="destination-grid home-destination-grid">{destinations.map(([name,note,image,href]) => <article className="image-card" key={name}><Image src={image} alt={name} fill sizes="(max-width: 700px) 100vw, 33vw" /><div className="card-shade" /><div className="image-card-copy"><p>{note}</p><h3>{name}</h3><Link href={href} className="button button-light">EXPLORE</Link></div></article>)}</div></div></section>

    <section className="cta-band final-cta"><Image src="/home/plan-journey.webp" alt="Turquoise lake and snow mountains in Yunnan" fill unoptimized sizes="100vw" /><div className="hero-shade" /><div><h2>Ready to plan your first journey through Yunnan?</h2><p>Tell us your dates, interests and preferred pace. You still travel in your own way—we simply help remove the friction.</p><Link href={whatsapp} className="button button-blue">START ON WHATSAPP</Link></div></section>
    <ContentFooter />
  </main>;
}
