"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EnquireLink } from "@/components/enquire-link";
import { HashLink } from "@/components/hash-link";
import { SiteSearch } from "@/components/site-search";
import { YunnanCountryGuideLink } from "@/components/yunnan-country-guide-link";

export type HeaderJourney = {
  slug: string;
  title: string;
  duration: string;
  image: string;
  sellingPoint: string;
  priceLabel: string;
};

const tailorMade = {
  href: "/custom-china-tour",
  title: "Tailor-Made Yunnan",
  duration: "Custom · Private",
  sellingPoint: "Private Journey Designed Around You",
  image: "/home/local-support.webp",
};

type MenuName = "destinations" | "journeys" | "guides" | "about";

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20a%20Yunnan%20journey";

const popular = ["Yunnan", "Dali", "Lijiang", "Shangri-La", "Xishuangbanna", "Kunming", "Shaxi", "Yuanyang"];
const regions = ["Yunnan", "Sichuan & Chongqing", "Beijing & North China", "Shanghai & the Lower Yangtze", "Xi’an & the Silk Road", "Guangxi & Guizhou", "Tibet & the Himalayas", "Southern China"];

const destinationHref = (label: string) => {
  if (label === "Yunnan") return "/china-destinations/yunnan";
  if (label === "Dali") return "/dali-travel-guide";
  if (label === "Shaxi") return "/dali-hidden-gems-off-the-beaten-path#shaxi-ancient-town-what-dali-looked-like-before-the-crowds-arrived";
  if (label === "Kunming") return "/kunming-travel-guide";
  if (label === "Lijiang") return "/china-destinations/yunnan#route";
  return `/search?q=${encodeURIComponent(label)}`;
};

const menuGroups: Record<"guides" | "about", { title: string; links: string[] }[]> = {
  guides: [
    { title: "Before you arrive", links: ["Visa & entry", "Visa checker", "Payments in China", "Currency converter", "Internet, VPN & eSIM", "Hotels for foreigners"] },
    { title: "Getting around", links: ["China trains", "Using Didi", "Maps & navigation", "Booking attraction tickets"] },
    { title: "Destination guides", links: ["Yunnan travel guide", "Kunming travel guide", "Dali travel guide", "Where to stay in Dali", "Dali hidden gems"] },
  ],
  about: [
    { title: "Hidden China Travel", links: ["About us", "Booking & service", "Why travel with us", "Our licensed agency"] },
    { title: "Our approach", links: ["Travel at your pace", "Experiences, not checklists", "Practical preparation", "Responsible local travel"] },
    { title: "Talk to us", links: ["Start a conversation", "Request a route check", "Get the Dali local guide", "WhatsApp support"] },
  ],
};

const guideHrefs: Record<string, string> = {
  "Visa & entry": "/do-i-need-a-visa-for-china",
  "Visa checker": "/china-visa-checker",
  "Payments in China": "/payments-in-china",
  "Currency converter": "/china-currency-converter",
  "Internet, VPN & eSIM": "/internet-in-china",
  "Hotels for foreigners": "/hotels-in-china",
  "China trains": "/book-china-high-speed-rail-foreigners",
  "Using Didi": "/how-to-use-didi-china-foreigners",
  "Maps & navigation": "/maps-navigation-in-china",
  "Booking attraction tickets": "/attraction-tickets-in-china",
  "Kunming travel guide": "/kunming-travel-guide",
  "Dali travel guide": "/dali-travel-guide",
  "Where to stay in Dali": "/where-to-stay-in-dali",
  "Dali hidden gems": "/dali-hidden-gems-off-the-beaten-path",
  "Yunnan travel guide": "/china-destinations/yunnan",
};

const hrefFor = (label: string) => {
  if (guideHrefs[label]) return guideHrefs[label];
  if (label === "About us") return "/about-us";
  if (label === "How we plan your journey" || label === "Booking & service") return "/booking";
  if (label === "Why travel with us") return "/about-us#why-us";
  if (label === "Our licensed agency" || label === "Our local partners") return "/about-us#local-partners";
  if (["Travel at your pace", "Experiences, not checklists", "Responsible local travel"].includes(label)) return "/about-us#our-approach";
  if (label === "Practical preparation") return "/china-travel-essentials";
  if (label === "Get the Dali local guide") return "/dali-travel-guide";
  if (label.includes("WhatsApp") || label.includes("conversation") || label.includes("route")) return whatsapp;
  return "/#guides";
};

function HeaderMailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="5.2" width="17.6" height="13.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M4.2 7.2 12 13.1l7.8-5.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

function HeaderMenuIcon({ open }: { open: boolean }) {
  return open
    ? <svg viewBox="0 0 24 16" aria-hidden="true"><path d="M4 1.5 20 14.5M20 1.5 4 14.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    : <svg viewBox="0 0 24 16" aria-hidden="true"><path d="M1 1.5h22M1 8h22M1 14.5h22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

export function SiteHeaderClient({ journeys, cta, conversion }: { journeys: HeaderJourney[]; cta?: { href: string; label: string; location?: string }; conversion?: boolean }) {
  const [open, setOpen] = useState<MenuName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const quoteHash = cta?.href.startsWith("#") ? cta.href : null;

  return <header className={conversion ? "site-header site-header-conversion" : "site-header"} onMouseLeave={() => setOpen(null)}>
    <div className="topbar shell">
      {quoteHash ? <HashLink className="header-mail" href={quoteHash} aria-label="Get a quote" data-cta-location={cta?.location || "header_mail"}><HeaderMailIcon /></HashLink> : <Link className="header-mail" href="/contact" aria-label="Contact us"><HeaderMailIcon /></Link>}
      <Link href="/" className="brand" aria-label="Hidden China Travel home">
        <Image src="/brand/logo.webp" alt="" width={160} height={80} className="brand-logo" unoptimized />
        <Image src="/brand/logo-light.png" alt="" width={160} height={80} className="brand-logo-light" unoptimized />
      </Link>
      <div className="header-contact">
        {conversion ? <Link href="/journeys" className="header-quiet-link">JOURNEYS</Link> : <span>Local insight, private journeys and personal support</span>}
        {cta ? (cta.href.startsWith("#") ? <HashLink className="button button-blue" href={cta.href} data-cta-location={cta.location || "header_journey_price"}>{cta.label}</HashLink> : <Link className="button button-blue" href={cta.href} data-cta-location={cta.location || "header_journey_price"}>{cta.label}</Link>) : <EnquireLink className="button button-blue" data-cta-location="header_custom"><span className="header-cta-full">PLAN MY YUNNAN TRIP</span><span className="header-cta-short">PLAN MY TRIP</span></EnquireLink>}
      </div>
      <button type="button" className="header-menu-toggle" aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen((value) => !value)}>
        <HeaderMenuIcon open={mobileOpen} />
        <span>{mobileOpen ? "CLOSE" : "MENU"}</span>
      </button>
    </div>
    {mobileOpen ? <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
      <Link href="/china-destinations/yunnan" onClick={() => setMobileOpen(false)}>DESTINATIONS</Link>
      <p className="mobile-nav-kicker">JOURNEYS</p>
      {journeys.map((journey) => <Link key={journey.slug} href={`/journeys/${journey.slug}`} className="mobile-nav-journey" onClick={() => setMobileOpen(false)}>
        <b>{journey.title}</b>
        <small>{[journey.priceLabel, journey.sellingPoint].filter(Boolean).join(" · ")}</small>
      </Link>)}
      <Link href={tailorMade.href} className="mobile-nav-journey" onClick={() => setMobileOpen(false)}>
        <b>{tailorMade.title}</b>
        <small>{tailorMade.sellingPoint}</small>
      </Link>
      <Link href="/journeys" className="mobile-nav-all" onClick={() => setMobileOpen(false)}>VIEW ALL JOURNEYS</Link>
      <Link href="/survival-kit" onClick={() => setMobileOpen(false)}>TRAVEL GUIDES</Link>
      <Link href="/about-us" onClick={() => setMobileOpen(false)}>ABOUT US</Link>
      <Link href="/booking" onClick={() => setMobileOpen(false)}>BOOKING &amp; SERVICE</Link>
      <Link href="/contact" onClick={() => setMobileOpen(false)}>CONTACT US</Link>
    </nav> : null}
    {conversion ? null : <nav className="nav-row" aria-label="Main navigation">
      <div className="shell nav-inner">
        <div className="nav-links">
          <button className={open === "destinations" ? "active" : ""} onClick={() => setOpen("destinations")} onMouseEnter={() => setOpen("destinations")} aria-expanded={open === "destinations"}>DESTINATIONS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "journeys" ? "active" : ""} onClick={() => setOpen("journeys")} onMouseEnter={() => setOpen("journeys")} aria-expanded={open === "journeys"}>JOURNEYS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "guides" ? "active" : ""} onClick={() => setOpen("guides")} onMouseEnter={() => setOpen("guides")} aria-expanded={open === "guides"}>TRAVEL GUIDES<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "about" ? "active" : ""} onClick={() => setOpen("about")} onMouseEnter={() => setOpen("about")} aria-expanded={open === "about"}>ABOUT US<span className="nav-chevron" aria-hidden="true" /></button>
          <Link href="/contact" onMouseEnter={() => setOpen(null)} onClick={() => setOpen(null)}>CONTACT US</Link>
        </div>
        <SiteSearch />
      </div>
    </nav>}

    {!conversion && open && <div className="mega-menu">
      {open === "destinations" ? <div className="shell mega-destinations">
        <section><h2>Most popular</h2><div className="mega-columns">{popular.map((item) => <Link key={item} href={destinationHref(item)}>{item}</Link>)}</div><Link className="mega-outline" href="/china-destinations/yunnan">EXPLORE YUNNAN</Link></section>
        <section><h2>Explore by region</h2><div className="mega-list">{regions.map((item) => <Link key={item} href={destinationHref(item)}>{item}</Link>)}</div></section>
        <section className="mega-featured"><h2>Begin with Yunnan</h2>{journeys.map((journey) => <Link key={journey.slug} href={`/journeys/${journey.slug}`}><Image src={encodeURI(journey.image)} alt={journey.title} width={150} height={88} unoptimized /><span><b>{journey.title}</b><small>{journey.sellingPoint}</small><em className="mega-journey-price">{journey.priceLabel}</em></span></Link>)}</section>
      </div> : open === "journeys" ? <div className="shell mega-journeys mega-journeys-current">
        <section className="mega-current-journeys">
          <p className="kicker">PRIVATE YUNNAN JOURNEYS</p>
          <h2>Start with one of our signature journeys.</h2>
          <div className="mega-current-journey-grid">
            {journeys.map((journey) => <Link key={journey.slug} href={`/journeys/${journey.slug}`}>
              <Image src={encodeURI(journey.image)} alt={journey.title} width={300} height={178} unoptimized />
              <span>
                <small>{journey.duration} · PRIVATE</small>
                <b>{journey.title}</b>
                <em>{journey.sellingPoint}</em>
                {journey.priceLabel ? <span className="mega-journey-price">{journey.priceLabel}</span> : null}
                <strong>VIEW JOURNEY →</strong>
              </span>
            </Link>)}
            <Link href={tailorMade.href} data-cta-location="header_journeys_custom">
              <Image src={tailorMade.image} alt={tailorMade.title} width={300} height={178} unoptimized />
              <span>
                <small>{tailorMade.duration}</small>
                <b>{tailorMade.title}</b>
                <em>{tailorMade.sellingPoint}</em>
                <strong>DESIGN YOUR JOURNEY →</strong>
              </span>
            </Link>
          </div>
          <Link href="/journeys" className="mega-text-link">VIEW ALL JOURNEYS →</Link>
        </section>
      </div> : open === "guides" ? <div className="shell mega-groups mega-guides">
        <section className="mega-survival-feature"><Image src="/assets/blog/independent-travel-china/cover.webp" alt="Travelers preparing for a journey through China" fill sizes="(max-width: 700px) 100vw, 30vw" unoptimized /><div><p>START HERE · FREE CHECKLIST</p><h2>Your China trip, prepared in one place.</h2><span>Entry, bookings, eSIM, VPN, payments and what to save before you fly.</span><Link className="button button-light" href="/survival-kit">OPEN THE SURVIVAL KIT →</Link></div></section>
        {menuGroups.guides.map(group => <section key={group.title}><h2>{group.title}</h2>{group.links.map(item => <Link key={item} href={hrefFor(item)}>{item}</Link>)}{group.title === "Destination guides" && <YunnanCountryGuideLink onSelect={() => setOpen(null)} />}</section>)}
      </div> : <div className="shell mega-groups">{menuGroups.about.map((group) => <section key={group.title}><h2>{group.title}</h2>{group.links.map((item) => <Link key={item} href={hrefFor(item)}>{item}</Link>)}</section>)}<section className="mega-callout"><p className="kicker">NOT SURE WHERE TO START?</p><h2>Tell us what kind of China trip you have in mind.</h2><Link href={whatsapp} className="button button-light">CHAT ON WHATSAPP</Link></section></div>}
      <button className="mega-close" onClick={() => setOpen(null)} aria-label="Close menu">×</button>
    </div>}
  </header>;
}
