import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  ["¥", "Payments", "Set up Alipay and WeChat Pay, with a backup plan if a payment fails.", "/payments-in-china"],
  ["⌁", "eSIMs & internet", "Choose the right connection and understand when a VPN may still help.", "/internet-in-china"],
  ["⌖", "Maps & navigation", "Use map apps that work in China instead of finding out after arrival.", "/maps-navigation-in-china"],
  ["✓", "Visas & entry", "Check visa-free and transit options before booking non-refundable flights.", "/china-visa-checker"],
  ["→", "Transport & booking", "Prepare for trains, hotels and ticket systems that can trip up first-time visitors.", "/transport-in-china"],
];
const guides = [
  ["FIRST TRIP", "China Travel Essentials", "The practical starting point for planning an independent trip to China.", "/china-travel-essentials"],
  ["PAYMENTS", "How to Pay in China", "Alipay, WeChat Pay, foreign cards and what to do when payment fails.", "/payments-in-china"],
  ["INTERNET", "Stay Connected in China", "eSIMs, SIM cards, VPNs and access to the apps you use every day.", "/internet-in-china"],
  ["HOTELS", "Hotels for Foreigners", "Choose suitable stays and understand passport registration at check-in.", "/hotels-in-china"],
  ["TRANSPORT", "Getting Around China", "High-speed trains, Didi, local transport and booking with a passport.", "/transport-in-china"],
  ["YUNNAN", "Dali Travel Guide", "Where to stay, how long to spend and how to explore at a gentler pace.", "/dali-travel-guide"],
];
const destinations = [
  ["Beijing", "Capital history, hutongs and a practical first-city base.", "https://hiddenchinatravel.com/brand/destinations/beijing.webp"],
  ["Shanghai", "Riverside neighborhoods and a smooth gateway for first-timers.", "https://hiddenchinatravel.com/brand/destinations/shanghai.webp"],
  ["Xi’an", "Terracotta warriors, city walls and Silk Road history.", "https://hiddenchinatravel.com/brand/destinations/xian.webp"],
  ["Chengdu", "Food, pandas and a calmer western-China rhythm.", "https://hiddenchinatravel.com/brand/destinations/chengdu.webp"],
  ["Yunnan", "Ancient towns, local cultures and journeys designed to be unhurried.", "https://hiddenchinatravel.com/brand/destinations/kunming.webp"],
  ["Guilin & Yangshuo", "Karst rivers, countryside stays and classic southern scenery.", "https://hiddenchinatravel.com/brand/destinations/guilin.webp"],
];
const faqs = [
  ["Do you offer private tours in Yunnan?", "Yes. Our current focus is private journeys for your own party, beginning with Dali, Shaxi and Lijiang."],
  ["Can your Yunnan journeys be customized?", "Yes. The published route is a starting point. Pace, hotel preferences and the balance between destinations can be adjusted before the final proposal."],
  ["Who operates the trips?", "Hidden China Travel helps shape the request and planning experience. Licensed local travel partners contract and provide the on-the-ground services confirmed in your proposal."],
  ["Can foreigners travel independently in China?", "Yes. Preparing payments, internet, maps, hotels and transport in advance makes independent travel much easier."],
  ["Do I need a visa for China?", "It depends on your passport, trip length and route. Use the visa checker before booking non-refundable travel."],
];

function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">H</span><h2>Hidden China Travel</h2><p>Travel guides, local expertise, and personalized journeys across Yunnan and beyond.</p></div><div><h3>Explore</h3><Link href="#destinations">Destinations</Link><Link href="#journeys">Yunnan journey</Link><Link href="#guides">China travel guides</Link></div><div><h3>Plan</h3><Link href={whatsapp}>Talk to us</Link><Link href="/about-us">About us</Link><Link href="/china-visa-checker">China visa checker</Link></div><div><h3>Practical</h3><Link href="/payments-in-china">Payments</Link><Link href="/internet-in-china">Internet & eSIM</Link><Link href="/transport-in-china">Getting around</Link></div></div><div className="shell footer-bottom"><span>© 2026 Hidden China Travel</span><span>Independent guidance · Local connections · Yunnan first</span></div></footer>;
}

export default function Home() {
  return <main><SiteHeader />
    <section className="hero"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp" alt="A historic street in Shaxi, Yunnan" fill priority sizes="100vw" /><div className="hero-shade" /><div className="hero-copy"><p>CHINA, AT YOUR PACE</p><h1>Discover China beyond<br />the usual tourist trail.</h1><div className="hero-actions"><Link href="#journeys" className="button button-light">EXPLORE OUR JOURNEY</Link><Link href={whatsapp} className="button button-blue">PLAN YOUR JOURNEY</Link></div><small>Trusted local expertise · Practical travel guides · Journeys designed around you</small></div></section>

    <section className="about-feature home-featured" id="journeys"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="Erhai Lake and mountains near Dali, Yunnan" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">FEATURED JOURNEY</p><h2>Start with Yunnan</h2><p>Our signature private journey through Dali, Shaxi and Lijiang—designed with enough time to experience each place rather than simply pass through it.</p><div className="journey-facts">{journeyFacts.map((fact) => <span key={fact}>{fact}</span>)}</div><ul className="highlight-list">{journeyHighlights.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><p className="journey-price">From ¥2,700 per person</p><Link href={whatsapp}>Explore this journey →</Link></div></section>

    <section className="story section-sand"><div className="shell story-grid"><div><p className="kicker">WHY WE EXIST</p><h2>Remember how China felt</h2></div><blockquote>“Most travelers remember the places they visited. We want you to remember how those places felt.”<cite>Our point of view</cite></blockquote><div className="story-note"><b>Local knowledge, seen from both sides.</b><p>Hidden China Travel combines Joy&apos;s Yunnan roots with her experience of living abroad and becoming the foreign visitor herself.</p><Link href="/about-us">Read our story →</Link></div></div></section>

    <section className="about-feature reverse home-founder"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">MEET JOY LIU</p><h2>Born in Yunnan.<br />Shaped by experiences abroad.</h2><p>Raised in Yunnan, Joy later lived in Japan and the Philippines. Being the foreigner taught her how much trusted local context can change a journey.</p><p>She created Hidden China Travel to make China feel a little less intimidating—and a lot more personal.</p><Link href="/about-us">About Joy →</Link></div></section>

    <section className="section why" id="why-us"><div className="shell"><div className="section-heading light"><p className="kicker">TRAVEL WITH CONFIDENCE</p><h2>Why travel with us?</h2></div><div className="reason-grid reason-grid-five">{reasons.map(([number,title,text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section section-sand survival-section" id="guides"><div className="shell"><div className="section-heading"><p className="kicker">PREPARE FOR CHINA</p><h2>Everything you need before you land</h2><p>Practical help for the systems that make a first trip feel unfamiliar.</p></div><div className="utility-grid">{survivalItems.map(([icon,title,text,href]) => <Link href={href} key={title} className="utility-card"><i>{icon}</i><h3>{title}</h3><p>{text}</p><span>READ THE GUIDE →</span></Link>)}</div><div className="center"><Link href="/survival-kit" className="button button-green">GET THE FULL CHECKLIST</Link></div></div></section>

    <section className="section guides-section"><div className="shell"><div className="section-heading"><p className="kicker">PRACTICAL CHINA TRAVEL GUIDES</p><h2>Start with what worries you most</h2><p>Clear, independent guidance for planning and navigating your first journey.</p></div><div className="guide-grid">{guides.map(([eyebrow,title,text,href],index) => <Link href={href} key={title} className="guide-card"><span>0{index+1} · {eyebrow}</span><h3>{title}</h3><p>{text}</p><b>READ MORE →</b></Link>)}</div></div></section>

    <section className="cta-band mid-cta"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="Everyday rural life near Shaxi" fill sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">INDEPENDENT FREEDOM, LOCAL SUPPORT</p><h2>Not sure how much help you need?</h2><p>Start with your rough route. We can help with one difficult transfer, a local guide, or a complete private journey.</p><Link href={whatsapp} className="button button-blue">ASK JOY</Link></div></section>

    <section className="section destinations-section" id="destinations"><div className="shell"><div className="section-heading"><p className="kicker">EXPLORE CHINA</p><h2>Where will your journey begin?</h2><p>Destination ideas, local context and a practical route into a very large country.</p></div><div className="destination-grid home-destination-grid">{destinations.map(([name,note,image]) => <article className="image-card" key={name}><Image src={image} alt={`${name}, China`} fill sizes="(max-width: 700px) 100vw, 33vw" /><div className="card-shade" /><div className="image-card-copy"><p>{note}</p><h3>{name}</h3><Link href={name === "Yunnan" ? "/china-destinations/yunnan" : "/china-destinations"} className="button button-light">EXPLORE</Link></div></article>)}</div></div></section>

    <section className="section faq-section" id="faqs"><div className="shell faq-layout"><div className="faq-intro"><p className="kicker">COMMON QUESTIONS</p><h2>Yunnan journeys and first-trip FAQs</h2><p>Quick answers about private travel, local operations and preparing for China.</p><Link href="/survival-kit">Explore the Survival Kit →</Link></div><div className="faq-list">{faqs.map(([question,answer],index) => <details key={question} open={index === 0}><summary><span>{question}</span><i>+</i></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="cta-band final-cta"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="A quiet street corner in Shaxi" fill sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">READY TO START THE CONVERSATION?</p><h2>Plan your first journey through Yunnan</h2><p>Tell us your dates, interests and preferred pace. You still travel in your own way—we simply help remove the friction.</p><Link href={whatsapp} className="button button-blue">START ON WHATSAPP</Link></div></section>
    <Footer />
  </main>;
}
