"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/locale-link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { EnquireLink } from "@/components/enquire-link";
import { HashLink } from "@/components/hash-link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SiteSearch } from "@/components/site-search";
import { YunnanCountryGuideLink } from "@/components/yunnan-country-guide-link";
import type { LocaleAlternate } from "@/lib/i18n-seo";

export type HeaderJourney = {
  slug: string;
  title: string;
  duration: string;
  image: string;
  sellingPoint: string;
  priceLabel: string;
};

const tailorMadeBase = {
  href: "/private-yunnan-tours",
  image: "/home/local-support.webp",
};

type MenuName = "destinations" | "journeys" | "experiences" | "guides" | "about";


const whatsapp = buildWhatsAppUrl();

const popular = ["Yunnan", "Dali", "Lijiang", "Shangri-La", "Xishuangbanna", "Kunming", "Shaxi", "Yuanyang"];
const regions = ["Yunnan"];

const destinationHref = (label: string, localizedLabel = label) => {
  if (label === "Yunnan") return "/china-destinations/yunnan";
  if (label === "Dali") return "/dali-travel-guide";
  if (label === "Shaxi") return "/shaxi-ancient-town-guide";
  if (label === "Kunming") return "/kunming-travel-guide";
  if (label === "Lijiang") return "/china-destinations/yunnan#route";
  return `/search?q=${encodeURIComponent(localizedLabel)}`;
};

const menuGroups: Record<"guides" | "about", { title: string; links: string[] }[]> = {
  guides: [
    { title: "Before you arrive", links: ["Visa & entry", "Visa checker", "Payments in China", "Currency converter", "Internet, VPN & eSIM", "Hotels for foreigners"] },
    { title: "Getting around", links: ["China trains", "Using Didi", "Maps & navigation", "Booking attraction tickets"] },
    { title: "Destination guides", links: ["Yunnan travel guide", "Kunming travel guide", "Dali travel guide", "Where to stay in Dali", "Dali hidden gems"] },
  ],
  about: [
    { title: "Hidden China Travel", links: ["About us", "Traveler stories", "Booking & service", "Why travel with us", "Our licensed agency"] },
    { title: "Our approach", links: ["Travel at your pace", "Experiences, not checklists", "Practical preparation", "Responsible local travel"] },
    { title: "Talk to us", links: ["Start a conversation", "Request a route check", "Get the Dali local guide", "WhatsApp support", "Contact us"] },
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
  if (label === "Contact us") return "/contact";
  if (label === "About us") return "/about-us";
  if (label === "Traveler stories") return "/traveler-stories";
  if (label === "How we plan your journey" || label === "Booking & service") return "/booking";
  if (label === "Why travel with us") return "/about-us#why-us";
  if (label === "Our licensed agency") return "/licensed-operator";
  if (label === "Our local partners") return "/about-us#local-partners";
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

export function SiteHeaderClient({ journeys, cta, alternate, searchInitialQuery, searchPlaceholder }: { journeys: HeaderJourney[]; cta?: { href: string; label: string; location?: string; mailHref?: string }; alternate?: LocaleAlternate; searchInitialQuery?: string; searchPlaceholder?: string }) {
  const [open, setOpen] = useState<MenuName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuName | null>(null);
  const t = useTranslations("header");
  const isZh = useLocale() === "zh";
  const T = (en: string, zh: string) => isZh ? zh : en;
  const menuItems: {id:MenuName;title:string}[] = [{id:"journeys",title:T("Private Tours","私人定制游")},{id:"experiences",title:T("Travel & Experiences","自由行与体验")},{id:"destinations",title:t("destinations")},{id:"guides",title:t("travelGuides")},{id:"about",title:t("aboutUs")}];
  const labels = t.raw("labels") as Record<string, string>;
  const label = (key: string) => labels[key] ?? key;
  const tailorMade = {
    ...tailorMadeBase,
    title: t("tailorMade.title"),
    duration: t("tailorMade.duration"),
    sellingPoint: t("tailorMade.sellingPoint"),
  };
  const quoteHash = cta?.mailHref?.startsWith("#") ? cta.mailHref : cta?.href.startsWith("#") ? cta.href : null;

  return <header className="site-header" onMouseLeave={() => setOpen(null)} onKeyDown={event=>{if(event.key==="Escape"){setOpen(null);setMobileOpen(false);}}}>
    <div className="topbar shell">
      {quoteHash ? <HashLink className="header-mail" href={quoteHash} aria-label={t("tripPlanAria")} data-cta-location={cta?.location || "header_mail"}><HeaderMailIcon /></HashLink> : <Link className="header-mail" href="/contact#enquire" scroll={false} aria-label={t("contactAria")}><HeaderMailIcon /></Link>}
      <Link href="/" className="brand" aria-label={t("homeAria")}>
        <Image src="/brand/logo.webp" alt="" width={160} height={80} className="brand-logo" unoptimized />
        <Image src="/brand/logo-light.png" alt="" width={160} height={80} className="brand-logo-light" unoptimized />
      </Link>
      <div className="header-contact">
        <span>{t("tagline")}</span>
        {cta ? (cta.href.startsWith("#") ? <HashLink className="button button-blue" href={cta.href} data-cta-location={cta.location || "header_journey_price"}>{cta.label}</HashLink> : <a className="button button-blue" href={cta.href} data-cta-location={cta.location || "header_journey_price"}>{cta.label}</a>) : <EnquireLink className="button button-blue" data-cta-location="header_custom"><span className="header-cta-full">{t("cta")}</span><span className="header-cta-short">{t("cta")}</span></EnquireLink>}
      </div>
      <LocaleSwitcher alternate={alternate} />
      <button type="button" className="header-menu-toggle" aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? t("close") : t("menu")} onClick={() => setMobileOpen((value) => !value)}>
        <HeaderMenuIcon open={mobileOpen} />
        <span>{mobileOpen ? t("close") : t("menu")}</span>
      </button>
    </div>
    {mobileOpen ? <nav id="mobile-nav" className="mobile-nav" aria-label={t("mobileAria")}>
      {menuItems.map(item => <div key={item.id}>
        <button type="button" className="mobile-nav-section" aria-expanded={mobileSection===item.id} aria-controls={"mobile-section-"+item.id} onClick={()=>setMobileSection(mobileSection===item.id?null:item.id)}>{item.title}<span aria-hidden="true">{mobileSection===item.id?"−":"+"}</span></button>
        <div id={"mobile-section-"+item.id} hidden={mobileSection!==item.id}>
          {item.id==="journeys"?<>
            <Link href={tailorMade.href} className="mobile-nav-journey" onClick={()=>setMobileOpen(false)}><b>{tailorMade.title}</b><small>{tailorMade.sellingPoint}</small></Link>
            <Link href="/yunnan-tour-packages" onClick={()=>setMobileOpen(false)}>{T("Yunnan Tour Packages","云南旅游套餐")}</Link>
            {journeys.map(journey=><Link key={journey.slug} href={`/journeys/${journey.slug}`} className="mobile-nav-journey" onClick={()=>setMobileOpen(false)}><b>{journey.title}</b><small>{journey.priceLabel}</small></Link>)}
          </>:item.id==="experiences"?<>
            <Link href="/yunnan-private-driver#multi-day-private-driver" data-cta-location="header_driver_multi" onClick={()=>setMobileOpen(false)}>{T("Multi-Day Private Drivers","多日私人包车")}</Link>
            <Link href="/yunnan-private-driver#private-car-by-day" data-cta-location="header_driver_day" onClick={()=>setMobileOpen(false)}>{T("Full-Day Private Car Hire","一日观光包车")}</Link>
            <Link href="/yunnan-private-driver#intercity-transfers" data-cta-location="header_driver_intercity" onClick={()=>setMobileOpen(false)}>{T("Intercity Transfers","跨城私人接送")}</Link>
            <Link href="/yunnan-private-driver#airport-station-transfers" data-cta-location="header_driver_arrival" onClick={()=>setMobileOpen(false)}>{T("Airport & Station Transfers","机场与车站接送")}</Link>
            <Link locale={isZh?"zh":"en"} href="/yunnan-experiences" data-cta-location="header_local_experiences" onClick={()=>setMobileOpen(false)}>{T("Local Experiences","特色文旅体验")}</Link>
          </>:item.id==="destinations"?popular.map(item=><Link key={item} href={destinationHref(item,label(item))} onClick={()=>setMobileOpen(false)}>{label(item)}</Link>):item.id==="guides"?<>
            <Link href="/survival-kit" onClick={()=>setMobileOpen(false)}>{T("China Travel Essentials","中国旅行指南")}</Link>
            {menuGroups.guides.map(group=><div key={group.title}><p className="mobile-nav-kicker">{label(group.title)}</p>{group.links.map(item=><Link key={item} href={hrefFor(item)} onClick={()=>setMobileOpen(false)}>{label(item)}</Link>)}</div>)}
          </>:<>
            <Link href="/about-us" onClick={()=>setMobileOpen(false)}>{t("aboutUs")}</Link>
            <Link href="/traveler-stories" onClick={()=>setMobileOpen(false)}>{t("travelerStories")}</Link>
            <Link href="/booking" onClick={()=>setMobileOpen(false)}>{t("bookingService")}</Link>
            <Link href="/licensed-operator" onClick={()=>setMobileOpen(false)}>{T("Our licensed agency","旅行社资质")}</Link>
            <Link href="/contact" onClick={()=>setMobileOpen(false)}>{t("contactUs")}</Link>
          </>}
        </div>
      </div>)}
      <LocaleSwitcher alternate={alternate} />
    </nav> : null}
    <nav className="nav-row" aria-label={t("mainAria")}>
      <div className="shell nav-inner">
        <div className="nav-links">
          {menuItems.map(item=><button key={item.id} type="button" className={open===item.id?"active":""} onClick={()=>setOpen(open===item.id?null:item.id)} onMouseEnter={()=>setOpen(item.id)} aria-expanded={open===item.id}>{item.title}<span className="nav-chevron" aria-hidden="true"/></button>)}
        </div>
        <SiteSearch initialQuery={searchInitialQuery} placeholderText={searchPlaceholder} autoOpen={Boolean(searchInitialQuery)} />
      </div>
    </nav>

    {open && <div className="mega-menu">
      {open === "destinations" ? <div className="shell mega-destinations">
        <section><h2>{t("mega.mostPopular")}</h2><div className="mega-columns">{popular.map((item) => <Link key={item} href={destinationHref(item, label(item))}>{label(item)}</Link>)}</div><Link className="mega-outline" href="/china-destinations/yunnan">{t("mega.exploreYunnan")}</Link></section>
        <section><h2>{t("mega.exploreByRegion")}</h2><div className="mega-list">{regions.map((item) => <Link key={item} href={destinationHref(item, label(item))}>{label(item)}</Link>)}</div></section>
        <section className="mega-featured"><h2>{t("mega.beginWithYunnan")}</h2>{journeys.map((journey) => <Link key={journey.slug} href={`/journeys/${journey.slug}`}><Image src={encodeURI(journey.image)} alt={journey.title} width={150} height={88} unoptimized /><span><b>{journey.title}</b><small>{journey.sellingPoint}</small><em className="mega-journey-price">{journey.priceLabel}</em></span></Link>)}</section>
      </div> : open === "journeys" ? <div className="shell mega-journeys mega-journeys-current">
        <section className="mega-current-journeys">
          <p className="kicker">{t("mega.privateJourneys")}</p>
          <h2>{t("mega.journeysHeading")}</h2>
          <div className="mega-current-journey-grid">
            {journeys.map((journey) => <Link key={journey.slug} href={`/journeys/${journey.slug}`}>
              <Image src={encodeURI(journey.image)} alt={journey.title} width={300} height={178} unoptimized />
              <span>
                <small>{journey.duration} · {t("mega.private")}</small>
                <b>{journey.title}</b>
                <em>{journey.sellingPoint}</em>
                {journey.priceLabel ? <span className="mega-journey-price">{journey.priceLabel}</span> : null}
                <strong>{t("mega.viewJourney")}</strong>
              </span>
            </Link>)}
            <Link href={tailorMade.href} data-cta-location="header_journeys_custom">
              <Image src={tailorMade.image} alt={tailorMade.title} width={300} height={178} unoptimized />
              <span>
                <small>{tailorMade.duration}</small>
                <b>{tailorMade.title}</b>
                <em>{tailorMade.sellingPoint}</em>
                <strong>{t("mega.designJourney")}</strong>
              </span>
            </Link>
          </div>
          <Link href="/yunnan-tour-packages" className="mega-text-link">{t("mega.viewAllJourneys")}</Link>

        </section>
      </div> : open === "experiences" ? <div className="shell mega-journeys mega-journeys-current">
        <section className="mega-current-journeys">
          <p className="kicker">{T("TRAVEL YOUR WAY","自由安排你的旅行")}</p>
          <h2>{T("Travel & Experiences","自由行与特色体验")}</h2>
          <div className="mega-current-journey-grid">
            <Link href="/yunnan-private-driver#multi-day-private-driver" data-cta-location="header_driver_multi"><Image src="/assets/destinations/yunnan/lijiang-shangri-la/private-transfer-mpv-exterior.webp" alt={T("Multi-Day Private Drivers","多日私人包车")} width={300} height={178} unoptimized/><span><small>{T("INDEPENDENT TRAVEL","自由行")}</small><b>{T("Multi-Day Private Drivers","多日私人包车")}</b><em>{T("Arrange your own hotels and route; keep a private driver for your journey.","自己安排酒店及路线，全程灵活私人用车。")}</em><strong>{T("Explore services","查看服务")}</strong></span></Link>
            <Link href="/yunnan-private-driver#private-car-by-day" data-cta-location="header_driver_day"><Image src="/assets/destinations/yunnan/dali-erhai-cover.webp" alt={T("Full-Day Private Car Hire","一日观光包车")} width={300} height={178} unoptimized/><span><small>{T("INDEPENDENT TRAVEL","自由行")}</small><b>{T("Full-Day Private Car Hire","一日观光包车")}</b><em>{T("Explore nearby sights at your own pace with a private driver.","专属车辆与司机，按自己的节奏游览周边景点。")}</em><strong>{T("Explore services","查看服务")}</strong></span></Link>
            <Link locale={isZh?"zh":"en"} href="/yunnan-experiences" data-cta-location="header_local_experiences"><Image src="/assets/experiences/dali-tie-dye/dali-tie-dye-indigo-fabric.webp" alt={T("Blue and white tie-dyed fabric","蓝白扎染布料")} width={300} height={178} unoptimized/><span><small>{T("LOCAL CULTURE","当地文化")}</small><b>{T("Local Experiences","特色文旅体验")}</b><em>{T("Discover local crafts and cultural activities, starting with Dali tie-dye.","探索云南当地手工艺与文化体验，从大理扎染开始。")}</em><strong>{T("Explore experiences","探索体验")}</strong></span></Link>
          </div>
          <Link href="/yunnan-private-driver#intercity-transfers" className="mega-text-link" data-cta-location="header_driver_intercity">{T("Intercity Transfers","跨城私人接送")}</Link>
          <Link href="/yunnan-private-driver#airport-station-transfers" className="mega-text-link" data-cta-location="header_driver_arrival">{T("Airport & Station Transfers","机场与车站接送")}</Link>
          <Link href="/yunnan-private-driver" className="mega-text-link">{T("All private driver services","全部包车与接送服务")}</Link>
        </section>
      </div> : open === "guides" ? <div className="shell mega-groups mega-guides">
        <section className="mega-survival-feature"><Image src="/assets/blog/independent-travel-china/cover.webp" alt={t("mega.survivalAlt")} fill sizes="(max-width: 700px) 100vw, 30vw" unoptimized /><div><p>{t("mega.startHere")}</p><h2>{t("mega.survivalTitle")}</h2><span>{t("mega.survivalText")}</span><Link className="button button-light" href="/survival-kit">{t("mega.openSurvival")}</Link></div></section>
        {menuGroups.guides.map(group => <section key={group.title}><h2>{label(group.title)}</h2>{group.links.map(item => <Link key={item} href={hrefFor(item)}>{item==="Contact us"?t("contactUs"):label(item)}</Link>)}{group.title === "Destination guides" && <YunnanCountryGuideLink onSelect={() => setOpen(null)} />}</section>)}
      </div> : <div className="shell mega-groups">{menuGroups.about.map((group) => <section key={group.title}><h2>{label(group.title)}</h2>{group.links.map((item) => <Link key={item} href={hrefFor(item)}>{item==="Contact us"?t("contactUs"):label(item)}</Link>)}</section>)}<section className="mega-callout"><p className="kicker">{t("mega.notSure")}</p><h2>{t("mega.notSureText")}</h2><Link href={whatsapp} className="button button-light">{t("mega.startPlanning")}</Link></section></div>}
      <button className="mega-close" onClick={() => setOpen(null)} aria-label={t("closeMenu")}>×</button>
    </div>}
  </header>;
}
