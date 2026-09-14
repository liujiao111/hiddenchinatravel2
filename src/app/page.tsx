import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GuidesExplorer } from "@/components/guides-explorer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Yunnan Private Tours & China Travel Guides | Hidden China Travel",
  description: "Discover private Yunnan journeys, practical China travel guides, local support, and personalized help for first-time visitors to China.",
};

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20first%20journey%20through%20Yunnan";
const journeyFacts = ["6 days", "Dali · Shaxi · Lijiang", "Private journey", "Unhurried pace"];
const journeyHighlights = ["Slow mornings beside Erhai Lake", "Bai culture and a traditional tie-dye workshop", "An evening in Shaxi on the Ancient Tea Horse Road", "Lijiang old-town life and mountain landscapes"];
const reasons = [
  ["01", "Private journeys", "Travel with your own party, at a pace that fits you—not a large coach group or fixed sightseeing schedule."],
  ["02", "No shopping stops", "Journeys are built around places, people and experiences, never mandatory shopping or commission-led detours."],
  ["03", "Licensed local partners", "Local travel partners provide the guides, drivers and on-the-ground services confirmed in your proposal."],
  ["04", "First-time China friendly", "We include the practical details that help an unfamiliar first trip feel much easier."],
  ["05", "Local support", "Questions and unexpected changes do not have to become travel-day stress."],
];
const survivalItems = [
  ["01", "Payments", "Set up Alipay and WeChat Pay, with a backup plan if a payment fails.", "/payments-in-china"],
  ["02", "Internet", "Choose the right connection and understand when a VPN may still help.", "/internet-in-china"],
  ["03", "Maps", "Use map apps that work in China instead of finding out after arrival.", "/maps-navigation-in-china"],
  ["04", "Visas", "Check visa-free and transit options before booking non-refundable flights.", "/china-visa-checker"],
  ["05", "Transport", "Prepare for trains, hotels and ticket systems that can trip up first-time visitors.", "/transport-in-china"],
];
const destinations = [
  ["Beijing", "Capital history, hutongs and a practical first-city base.", "https://hiddenchinatravel.com/brand/destinations/beijing.webp"],
  ["Shanghai", "Riverside neighborhoods and a smooth gateway for first-timers.", "https://hiddenchinatravel.com/brand/destinations/shanghai.webp"],
  ["Xi’an", "Terracotta warriors, city walls and Silk Road history.", "https://hiddenchinatravel.com/brand/destinations/xian.webp"],
  ["Chengdu", "Food, pandas and a calmer western-China rhythm.", "https://hiddenchinatravel.com/brand/destinations/chengdu.webp"],
  ["Yunnan", "Ancient towns, local cultures and journeys designed to be unhurried.", "https://hiddenchinatravel.com/brand/destinations/kunming.webp"],
  ["Guilin & Yangshuo", "Karst rivers, countryside stays and classic southern scenery.", "https://hiddenchinatravel.com/brand/destinations/guilin.webp"],
];

function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">H</span><h2>Hidden China Travel</h2><p>Travel guides, local expertise, and personalized journeys across Yunnan and beyond.</p></div><div><h3>Explore</h3><Link href="#destinations">Destinations</Link><Link href="#journeys">Yunnan journey</Link><Link href="#guides">China travel guides</Link></div><div><h3>Plan</h3><Link href={whatsapp}>Talk to us</Link><Link href="/about-us">About us</Link><Link href="/china-visa-checker">China visa checker</Link></div><div><h3>Practical</h3><Link href="/payments-in-china">Payments</Link><Link href="/internet-in-china">Internet & eSIM</Link><Link href="/transport-in-china">Getting around</Link></div></div><div className="shell footer-bottom"><span>© 2026 Hidden China Travel</span><span>Independent guidance · Local connections · Yunnan first</span></div></footer>;
}

export default function Home() {
  return <main><SiteHeader />
    <section className="hero"><Image src="/home/hero.webp" alt="Snow-capped mountains in Yunnan" fill preload unoptimized sizes="100vw" /><div className="hero-shade" /><div className="hero-copy"><h1>China, at Your Pace.</h1><p>Discover China beyond the usual tourist trail—with trusted local expertise, practical travel guides, and journeys designed around you.</p><div className="hero-actions"><Link href="#journeys" className="button button-light">EXPLORE OUR JOURNEY</Link><Link href={whatsapp} className="button button-blue">PLAN YOUR JOURNEY</Link></div></div></section>
    <section className="hero-bridge"><div className="narrow"><h2>A more personal way to experience China</h2><p>Travel independently or ask for more support. We make the unfamiliar parts clearer, then connect you with trusted local people when your journey needs them.</p></div></section>

    <section className="about-feature home-featured" id="journeys"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="Erhai Lake and mountains near Dali, Yunnan" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><h2>Featured Yunnan journey</h2><h3 className="feature-name">Dali, Shaxi & Lijiang</h3><p>Our signature private journey—designed with enough time to experience each place rather than simply pass through it.</p><div className="journey-facts">{journeyFacts.map((fact) => <span key={fact}>{fact}</span>)}</div><ul className="highlight-list">{journeyHighlights.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><p className="journey-price">From ¥2,700 per person</p><Link href={whatsapp}>Explore this journey →</Link></div></section>

    <section className="story section-sand"><div className="shell story-grid"><div><h2>Why Hidden China Travel exists</h2></div><blockquote>“Most travelers remember the places they visited. We want you to remember how those places felt.”<cite>Our point of view</cite></blockquote><div className="story-note"><b>Local knowledge, seen from both sides.</b><p>Hidden China Travel combines Joy&apos;s Yunnan roots with her experience of living abroad and becoming the foreign visitor herself.</p><Link href="/about-us">Read our story →</Link></div></div></section>

    <section className="about-feature reverse home-founder"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><h2>Meet Joy Liu</h2><h3 className="feature-name">Born in Yunnan. Shaped by experiences abroad.</h3><p>Raised in Yunnan, Joy later lived in Japan and the Philippines. Being the foreigner taught her how much trusted local context can change a journey.</p><p>She created Hidden China Travel to make China feel a little less intimidating—and a lot more personal.</p><Link href="/about-us">About Joy →</Link></div></section>

    <section className="section why" id="why-us"><div className="shell"><div className="section-heading light"><h2>Why travel with us?</h2></div><div className="reason-grid reason-grid-five">{reasons.map(([number,title,text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section section-sand survival-section" id="guides"><div className="shell"><div className="section-heading"><h2>Prepare for your China trip</h2><p>Payments, internet, maps, visas and transport—the systems worth sorting before you land.</p></div><div className="utility-grid">{survivalItems.map(([number,title,text,href]) => <Link href={href} key={title} className="utility-card"><i>{number}</i><h3>{title}</h3><p>{text}</p><span>READ THE GUIDE →</span></Link>)}</div><div className="center"><Link href="/survival-kit" className="button button-green">GET THE FULL CHECKLIST</Link></div></div></section>

    <section className="section guides-section"><div className="shell"><div className="section-heading"><h2>Practical China Travel Guides</h2><p>Choose the topic you want to make easier before your first journey.</p></div><GuidesExplorer /></div></section>

    <section className="cta-band mid-cta"><Image src="/home/local-support.webp" alt="A wooden boat on a highland lake in Yunnan" fill unoptimized sizes="100vw" /><div className="hero-shade" /><div><h2>Independent freedom, local support</h2><p>Start with your rough route. We can help with one difficult transfer, a local guide, or a complete private journey.</p><Link href={whatsapp} className="button button-blue">ASK JOY</Link></div></section>

    <section className="section destinations-section" id="destinations"><div className="shell"><div className="section-heading"><h2>Explore China</h2><p>Destination ideas, local context and a practical route into a very large country.</p></div><div className="destination-grid home-destination-grid">{destinations.map(([name,note,image]) => <article className="image-card" key={name}><Image src={image} alt={`${name}, China`} fill sizes="(max-width: 700px) 100vw, 33vw" /><div className="card-shade" /><div className="image-card-copy"><p>{note}</p><h3>{name}</h3><Link href={name === "Yunnan" ? "/china-destinations/yunnan" : "/china-destinations"} className="button button-light">EXPLORE</Link></div></article>)}</div></div></section>

    <section className="cta-band final-cta"><Image src="/home/plan-journey.webp" alt="Turquoise lake and snow mountains in Yunnan" fill unoptimized sizes="100vw" /><div className="hero-shade" /><div><h2>Ready to plan your first journey through Yunnan?</h2><p>Tell us your dates, interests and preferred pace. You still travel in your own way—we simply help remove the friction.</p><Link href={whatsapp} className="button button-blue">START ON WHATSAPP</Link></div></section>
    <Footer />
  </main>;
}
