"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteSearch } from "@/components/site-search";

type MenuName = "destinations" | "journeys" | "guides" | "about";

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20a%20Yunnan%20journey";

const popular = ["Yunnan", "Dali", "Lijiang", "Shangri-La", "Xishuangbanna", "Kunming", "Shaxi", "Yuanyang"];
const regions = ["Yunnan", "Sichuan & Chongqing", "Beijing & North China", "Shanghai & the Lower Yangtze", "Xi’an & the Silk Road", "Guangxi & Guizhou", "Tibet & the Himalayas", "Southern China"];

const menuGroups: Record<"guides" | "about", { title: string; links: string[] }[]> = {
  guides: [
    { title: "Before you arrive", links: ["Visa & entry", "Payments in China", "Internet, VPN & eSIM", "Hotels for foreigners"] },
    { title: "Getting around", links: ["China trains", "Using Didi", "Maps & navigation", "Booking attraction tickets"] },
    { title: "Destination guides", links: ["Dali travel guide", "Where to stay in Dali", "Dali hidden gems", "Yunnan itineraries"] },
  ],
  about: [
    { title: "Hidden China Travel", links: ["About us", "How we plan your journey", "Why travel with us", "Our local partners"] },
    { title: "Our approach", links: ["Travel at your pace", "Experiences, not checklists", "Practical preparation", "Responsible local travel"] },
    { title: "Talk to us", links: ["Start a conversation", "Request a route check", "Get the Dali local guide", "WhatsApp support"] },
  ],
};

const hrefFor = (label: string) => {
  if (label === "About us") return "/about-us";
  if (label.includes("WhatsApp") || label.includes("conversation") || label.includes("route") || label.includes("journey")) return whatsapp;
  return "/#guides";
};

export function SiteHeader() {
  const [open, setOpen] = useState<MenuName | null>(null);
  const toggle = (menu: MenuName) => setOpen((current) => current === menu ? null : menu);

  return <header className="site-header" onMouseLeave={() => setOpen(null)}>
    <div className="topbar shell">
      <Link href="/" className="brand" aria-label="Hidden China Travel home"><Image src="/brand/logo.webp" alt="Hidden China Travel" width={160} height={80} className="brand-logo" unoptimized /></Link>
      <div className="header-contact"><span>Local insight for independent-minded travelers</span><Link className="button button-blue" href={whatsapp}>PLAN MY JOURNEY</Link></div>
    </div>
    <nav className="nav-row" aria-label="Main navigation">
      <div className="shell nav-inner">
        <div className="nav-links">
          <button className={open === "destinations" ? "active" : ""} onClick={() => toggle("destinations")} onMouseEnter={() => setOpen("destinations")} aria-expanded={open === "destinations"}>DESTINATIONS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "journeys" ? "active" : ""} onClick={() => toggle("journeys")} onMouseEnter={() => setOpen("journeys")} aria-expanded={open === "journeys"}>JOURNEYS<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "guides" ? "active" : ""} onClick={() => toggle("guides")} onMouseEnter={() => setOpen("guides")} aria-expanded={open === "guides"}>TRAVEL GUIDES<span className="nav-chevron" aria-hidden="true" /></button>
          <button className={open === "about" ? "active" : ""} onClick={() => toggle("about")} onMouseEnter={() => setOpen("about")} aria-expanded={open === "about"}>ABOUT US<span className="nav-chevron" aria-hidden="true" /></button>
        </div>
        <SiteSearch />
      </div>
    </nav>

    {open && <div className="mega-menu">
      {open === "destinations" ? <div className="shell mega-destinations">
        <section><h2>Most popular</h2><div className="mega-columns">{popular.map((item) => <Link key={item} href="/#destinations">{item}</Link>)}</div><Link className="mega-outline" href="/#destinations">ALL DESTINATIONS A–Z</Link></section>
        <section><h2>Explore by region</h2><div className="mega-list">{regions.map((item) => <Link key={item} href="/#destinations">{item}</Link>)}</div></section>
        <section className="mega-featured"><h2>Begin with Yunnan</h2><Link href="/#journeys"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp" alt="Shaxi in Yunnan" width={150} height={88} /><span><b>Dali & the Tea Horse Road</b><small>A slower 7-day journey</small></span></Link><Link href="/about-us"><Image src="https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="Erhai Lake in Dali" width={150} height={88} /><span><b>New to China?</b><small>See how we make it easier</small></span></Link></section>
      </div> : open === "journeys" ? <div className="shell mega-journeys">
        <section className="mega-journey-feature"><p className="kicker">FEATURED JOURNEY</p><Link href="/journeys/kunming-dali-shaxi-lijiang-6-days"><Image src="/home/hero.webp" alt="A private journey through Yunnan" width={460} height={250} unoptimized /><span><small>6 DAYS · PRIVATE JOURNEY</small><b>Kunming, Dali, Shaxi & Lijiang</b><em>From ¥2,700 per person</em><strong>VIEW JOURNEY →</strong></span></Link></section>
        <section><h2>Explore by place</h2>{["Yunnan", "Dali", "Shaxi", "Lijiang", "Xishuangbanna", "Shangri-La"].map((item) => <Link key={item} href="/journeys">{item}</Link>)}<Link href="/journeys" className="mega-text-link">VIEW ALL JOURNEYS →</Link></section>
        <section><h2>Travel your way</h2>{["Private journeys", "Slow-paced travel", "First trip to China", "Family journeys", "Journeys for older travelers"].map((item) => <Link key={item} href="/journeys">{item}</Link>)}</section>
        <section className="mega-callout"><p className="kicker">NOT SURE WHICH ROUTE FITS?</p><h2>Tell Joy how you like to travel.</h2><Link href={whatsapp} className="button button-light">CHAT WITH JOY</Link></section>
      </div> : <div className="shell mega-groups">{menuGroups[open].map((group) => <section key={group.title}><h2>{group.title}</h2>{group.links.map((item) => <Link key={item} href={hrefFor(item)}>{item}</Link>)}</section>)}<section className="mega-callout"><p className="kicker">NOT SURE WHERE TO START?</p><h2>Tell us what kind of China trip you have in mind.</h2><Link href={whatsapp} className="button button-light">CHAT ON WHATSAPP</Link></section></div>}
      <button className="mega-close" onClick={() => setOpen(null)} aria-label="Close menu">×</button>
    </div>}
  </header>;
}
