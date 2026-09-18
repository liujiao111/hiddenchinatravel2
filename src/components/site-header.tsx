"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteSearch } from "@/components/site-search";

type MenuName = "destinations" | "journeys" | "guides" | "about";

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20a%20Yunnan%20journey";

const popular = ["Yunnan", "Dali", "Lijiang", "Shangri-La", "Xishuangbanna", "Kunming", "Shaxi", "Yuanyang"];
const regions = ["Yunnan", "Sichuan & Chongqing", "Beijing & North China", "Shanghai & the Lower Yangtze", "Xi’an & the Silk Road", "Guangxi & Guizhou", "Tibet & the Himalayas", "Southern China"];

const destinationHref = (label: string) => {
  if (label === "Yunnan") return "/china-destinations/yunnan";
  if (label === "Dali") return "/dali-travel-guide";
  if (label === "Shaxi") return "/dali-hidden-gems-off-the-beaten-path#shaxi-ancient-town-what-dali-looked-like-before-the-crowds-arrived";
  if (label === "Lijiang" || label === "Kunming") return "/china-destinations/yunnan#route";
  return `/search?q=${encodeURIComponent(label)}`;
};

const menuGroups: Record<"guides" | "about", { title: string; links: string[] }[]> = {
  guides: [
    { title: "Before you arrive", links: ["Visa & entry", "Visa checker", "Payments in China", "Currency converter", "Internet, VPN & eSIM", "Hotels for foreigners"] },
    { title: "Getting around", links: ["China trains", "Using Didi", "Maps & navigation", "Booking attraction tickets"] },
    { title: "Destination guides", links: ["Yunnan travel guide", "Dali travel guide", "Where to stay in Dali", "Dali hidden gems"] },
  ],
  about: [
    { title: "Hidden China Travel", links: ["About us", "How we plan your journey", "Why travel with us", "Our local partners"] },
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
  "Dali travel guide": "/dali-travel-guide",
  "Where to stay in Dali": "/where-to-stay-in-dali",
  "Dali hidden gems": "/dali-hidden-gems-off-the-beaten-path",
  "Yunnan travel guide": "/china-destinations/yunnan",
};

const hrefFor = (label: string) => {
  if (guideHrefs[label]) return guideHrefs[label];
  if (label === "About us") return "/about-us";
  if (label === "How we plan your journey") return "/about-us#how-it-works";
  if (label === "Why travel with us") return "/about-us#why-us";
  if (label === "Our local partners") return "/about-us#local-partners";
  if (["Travel at your pace", "Experiences, not checklists", "Responsible local travel"].includes(label)) return "/about-us#our-approach";
  if (label === "Practical preparation") return "/china-travel-essentials";
  if (label === "Get the Dali local guide") return "/dali-travel-guide";
  if (label.includes("WhatsApp") || label.includes("conversation") || label.includes("route")) return whatsapp;
  return "/#guides";
};

export function SiteHeader() {
  const [open, setOpen] = useState<MenuName | null>(null);

  return <header className="site-header" onMouseLeave={() => setOpen(null)}>
    <div className="topbar shell">
      <Link href="/" className="brand" aria-label="Hidden China Travel home"><Image src="/brand/logo.webp" alt="Hidden China Travel" width={160} height={80} className="brand-logo" unoptimized /></Link>
      <div className="header-contact"><span>Local insight, private journeys and personal support</span><Link className="button button-blue" href={whatsapp}>PLAN MY JOURNEY</Link></div>
    </div>
    <nav className="nav-row" aria-label="Main navigation">
      <div className="shell nav-inner">
        <div className="nav-links">
          <button className={open === "destinations" ? "active" : ""} onClick={() => setOpen("destinations")} onMouseEnter={() => setOpen("destinations")} aria-expanded={open === "destinations"}>DESTINATIONS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "journeys" ? "active" : ""} onClick={() => setOpen("journeys")} onMouseEnter={() => setOpen("journeys")} aria-expanded={open === "journeys"}>JOURNEYS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "guides" ? "active" : ""} onClick={() => setOpen("guides")} onMouseEnter={() => setOpen("guides")} aria-expanded={open === "guides"}>TRAVEL GUIDES<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "about" ? "active" : ""} onClick={() => setOpen("about")} onMouseEnter={() => setOpen("about")} aria-expanded={open === "about"}>ABOUT US<span className="nav-chevron" aria-hidden="true" /></button>
        </div>
        <SiteSearch />
      </div>
    </nav>

    {open && <div className="mega-menu">
      {open === "destinations" ? <div className="shell mega-destinations">
        <section><h2>Most popular</h2><div className="mega-columns">{popular.map((item) => <Link key={item} href={destinationHref(item)}>{item}</Link>)}</div><Link className="mega-outline" href="/china-destinations/yunnan">EXPLORE YUNNAN</Link></section>
        <section><h2>Explore by region</h2><div className="mega-list">{regions.map((item) => <Link key={item} href={destinationHref(item)}>{item}</Link>)}</div></section>
        <section className="mega-featured"><h2>Begin with Yunnan</h2><Link href="/journeys/kunming-dali-shaxi-lijiang-6-days"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp" alt="Shaxi in Yunnan" width={150} height={88} /><span><b>Kunming, Dali, Shaxi & Lijiang</b><small>A 6-day private journey</small></span></Link><Link href="/about-us"><Image src="/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="Erhai Lake in Dali" width={150} height={88} /><span><b>New to China?</b><small>See how we make it easier</small></span></Link></section>
      </div> : open === "journeys" ? <div className="shell mega-journeys">
        <section className="mega-journey-feature"><p className="kicker">FEATURED JOURNEY</p><Link href="/journeys/kunming-dali-shaxi-lijiang-6-days"><Image src="/home/hero.webp" alt="A private journey through Yunnan" width={460} height={250} unoptimized /><span><small>6 DAYS · PRIVATE JOURNEY</small><b>Kunming, Dali, Shaxi & Lijiang</b><em>Private · Unhurried · No shopping stops</em><strong>VIEW JOURNEY →</strong></span></Link></section>
        <section><h2>Explore by place</h2>{["Yunnan", "Dali", "Shaxi", "Lijiang", "Xishuangbanna", "Shangri-La"].map((item) => <Link key={item} href="/journeys">{item}</Link>)}<Link href="/journeys" className="mega-text-link">VIEW ALL JOURNEYS →</Link></section>
        <section><h2>Travel your way</h2>{["Private journeys", "Slow-paced travel", "First trip to China", "Family journeys", "Journeys for older travelers"].map((item) => <Link key={item} href="/journeys">{item}</Link>)}</section>
        <section className="mega-callout"><p className="kicker">NOT SURE WHICH ROUTE FITS?</p><h2>Tell Joy how you like to travel.</h2><Link href={whatsapp} className="button button-light">CHAT WITH JOY</Link></section>
      </div> : open === "guides" ? <div className="shell mega-groups mega-guides">
        <section className="mega-survival-feature"><Image src="/assets/blog/independent-travel-china/cover.webp" alt="Travelers preparing for a journey through China" fill sizes="(max-width: 700px) 100vw, 30vw" unoptimized /><div><p>START HERE · FREE CHECKLIST</p><h2>Your China trip, prepared in one place.</h2><span>Entry, bookings, eSIM, VPN, payments and what to save before you fly.</span><Link className="button button-light" href="/survival-kit">OPEN THE SURVIVAL KIT →</Link></div></section>
        {menuGroups.guides.map(group => <section key={group.title}><h2>{group.title}</h2>{group.links.map(item => <Link key={item} href={hrefFor(item)}>{item}</Link>)}{group.title === "Destination guides" && <div className="mega-country-guides"><h3>Plan from your country</h3><Link href="/yunnan-travel-from-singapore">Yunnan from Singapore</Link><Link href="/yunnan-travel-from-usa">Yunnan from the USA</Link></div>}</section>)}
      </div> : <div className="shell mega-groups">{menuGroups.about.map((group) => <section key={group.title}><h2>{group.title}</h2>{group.links.map((item) => <Link key={item} href={hrefFor(item)}>{item}</Link>)}</section>)}<section className="mega-callout"><p className="kicker">NOT SURE WHERE TO START?</p><h2>Tell us what kind of China trip you have in mind.</h2><Link href={whatsapp} className="button button-light">CHAT ON WHATSAPP</Link></section></div>}
      <button className="mega-close" onClick={() => setOpen(null)} aria-label="Close menu">×</button>
    </div>}
  </header>;
}
