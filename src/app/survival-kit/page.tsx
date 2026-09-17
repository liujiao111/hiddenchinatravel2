import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import { PrepChecklist } from "@/components/survival-kit/prep-checklist";
import { getAllJourneys } from "@/lib/journeys";
import { formatPriceLabel } from "@/lib/format-price";
import "./survival-kit.css";

export const metadata: Metadata = {
  title: "China Trip Preparation Checklist (2026): Visa, eSIM, Payments & Bookings",
  description: "Prepare for your China trip in order: check entry rules, book essentials, set up data and payments, then save an arrival checklist. Practical guides and optional booking links.",
  keywords: ["China travel checklist", "China trip preparation", "China travel essentials", "China eSIM", "paying in China"],
  alternates: { canonical: "/survival-kit" },
  openGraph: { title: "China Trip Preparation Checklist | Hidden China Travel", description: "The practical steps to sort before you land in China.", url: "/survival-kit", type: "website", images: [{ url: "/assets/blog/independent-travel-china/cover.webp" }] },
  twitter: { card: "summary_large_image", title: "China Trip Preparation Checklist", description: "Visa, bookings, eSIM, VPN, payments and arrival essentials in one practical checklist." },
};

type Action = { label: string; href: string; affiliate?: boolean };
type Step = { number: string; id: string; title: string; why: string; task: string; guide: Action; options?: { name: string; detail: string; action: Action }[] };

const stages: { id: string; label: string; intro: string; steps: Step[] }[] = [
  { id: "decide", label: "01 · Confirm the trip", intro: "Sort the decisions that affect what you can book.", steps: [
    { number: "01", id: "entry", title: "Check your entry route", why: "Rules depend on your passport, purpose and itinerary. Confirm the current terms with the relevant Chinese embassy or consulate before buying nonrefundable travel.", task: "Check visa-free, visa and transit options for your passport.", guide: { label: "Read the visa guide", href: "/do-i-need-a-visa-for-china" } },
    { number: "02", id: "route", title: "Choose your pace and route", why: "Decide how many places you can enjoy without spending the trip in transit. Start with a realistic route, then book around it.", task: "Sketch the cities and number of nights; keep room for arrival and travel days.", guide: { label: "How to plan a China itinerary", href: "/how-to-plan-china-itinerary" } },
  ] },
  { id: "book", label: "02 · Reserve the essentials", intro: "Book the parts with limited availability or high stakes for arrival.", steps: [
    { number: "03", id: "hotel", title: "Secure your first nights", why: "Check location, cancellation terms and that the property can register a guest using a foreign passport. Keep the address in Chinese for your arrival.", task: "Book your first hotel and save its Chinese name and address.", guide: { label: "Hotels for foreign visitors", href: "/hotels-in-china-for-foreigners" }, options: [{ name: "Hotels on Trip.com", detail: "Compare locations and passport guest policies before payment.", action: { label: "Search hotels", href: "/go/trip-hotels", affiliate: true } }] },
    { number: "04", id: "transport", title: "Plan trains and timed entry", why: "Train seats and popular sights may sell out. Enter your name and passport number exactly as shown on your travel document.", task: "Reserve intercity trains and any attractions that require advance booking.", guide: { label: "Train booking guide", href: "/book-china-high-speed-rail-foreigners" }, options: [
      { name: "High-speed trains", detail: "Compare departures and check passport details before checkout.", action: { label: "Search trains", href: "/go/trip-trains", affiliate: true } },
      { name: "Attraction tickets", detail: "Check the official reservation rules for each sight first.", action: { label: "Search tickets", href: "/go/trip-tickets", affiliate: true } },
    ] },
  ] },
  { id: "setup", label: "03 · Set up your phone", intro: "Build a reliable arrival setup while your usual connection and card support are available.", steps: [
    { number: "05", id: "esim", title: "Get mobile data for arrival", why: "Choose between home roaming and a travel eSIM. Check that your phone supports eSIM, then compare data allowances, validity and coverage. A travel eSIM usually does not include a mainland Chinese phone number.", task: "Install your plan before departure and save the activation instructions offline.", guide: { label: "Compare the best eSIMs for China", href: "/best-esim-for-china-travel" } },
    { number: "06", id: "vpn", title: "Decide if you need a VPN", why: "Your connection type matters. If you expect to use local Wi-Fi or a local SIM, read the guide and set up a VPN before you leave. No provider works consistently on every network.", task: "If you choose one, install it, sign in and test it at home.", guide: { label: "Read Best VPN for China", href: "/best-vpn-for-china" } },
    { number: "07", id: "payment", title: "Prepare two ways to pay", why: "Set up Alipay with your own passport and card before leaving. WeChat Pay or a little cash can be a useful backup if verification or a transaction fails.", task: "Complete verification and try a small payment when practical.", guide: { label: "Set up Alipay", href: "/alipay-for-foreigners-china" }, options: [{ name: "Payment backup", detail: "Know the common failure points before you arrive.", action: { label: "Read payment troubleshooting", href: "/why-your-payment-fails-in-china" } }] },
    { number: "08", id: "maps", title: "Save your first destination", why: "Install a map app that works well in mainland China. Save the hotel and arrival station in both English and Chinese.", task: "Open Amap, search for your hotel and keep a screenshot of the address.", guide: { label: "Amap and navigation guide", href: "/google-maps-china-not-working" } },
  ] },
];

const connectionOptions = {
  esim: [
    { name: "Airalo", logo: "/assets/survival-kit/apps/airalo.svg", detail: "Travel data through a dedicated eSIM app. Check the plan that fits your length of stay.", action: { label: "VIEW AIRALO PLANS", href: "/go/airalo", affiliate: true } },
    { name: "Trip.com eSIM", logo: "/assets/survival-kit/apps/trip.svg", detail: "Compare daily data and validity against your itinerary before checkout.", action: { label: "VIEW TRIP.COM ESIMS", href: "/go/trip-esim", affiliate: true } },
  ],
  vpn: [
    { name: "ExpressVPN", logo: "/assets/survival-kit/apps/expressvpn.svg", detail: "Compare setup and current availability in our VPN guide.", action: { label: "EXPLORE EXPRESSVPN", href: "/go/expressvpn", affiliate: true } },
    { name: "NordVPN", logo: "/assets/survival-kit/apps/nordvpn.svg", detail: "A second option to assess for your devices and network.", action: { label: "EXPLORE NORDVPN", href: "/go/nordvpn", affiliate: true } },
    { name: "Astrill VPN", logo: null, detail: "An additional option to compare. Test any VPN before your trip.", action: { label: "EXPLORE ASTRILL", href: "https://www.astrill.com/a/u4ketarjcwd0", affiliate: true } },
  ],
};

const faqs = [
  { question: "What should I prepare first for a trip to China?", answer: "Check the entry rules for your passport and route first. Then choose a realistic itinerary, book your first nights and essential transport, and set up mobile data, payments and maps before departure." },
  { question: "Can I use a travel eSIM instead of a Chinese SIM card?", answer: "For many short trips, a compatible travel eSIM can provide data on arrival. It usually does not provide a mainland Chinese phone number, which some local services require for SMS verification. Compare your own roaming plan and eSIM options before buying." },
  { question: "Do I need both an eSIM and a VPN for China?", answer: "Not always. A travel eSIM or international roaming can behave differently from a local SIM or hotel Wi-Fi. A VPN is a separate choice for some local connections; availability changes by network. Read the VPN guide and test your setup before leaving." },
  { question: "Should I set up Alipay before I travel?", answer: "Yes. Install Alipay and link your own passport and payment card while you can still access your bank's verification messages. Keep WeChat Pay or some cash as a backup." },
  { question: "What should I save offline before arriving?", answer: "Save your first hotel's Chinese name and address, booking confirmations, passport and entry document copies, insurance details, and embassy or consulate contacts. Keep sensitive copies in a secure place." },
];

function ActionLink({ action, primary = false }: { action: Action; primary?: boolean }) {
  return <Link href={action.href} className={primary ? "button button-green" : "kit-text-link"} {...(action.affiliate ? { rel: "sponsored nofollow" } : {})}>{action.label}<span aria-hidden="true"> →</span></Link>;
}

export default function SurvivalKitPage() {
  const featuredJourney = getAllJourneys().find(journey => journey.frontmatter.featured) ?? getAllJourneys()[0];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <main><SiteHeader />
    <header className="journey-hero kit-hero"><Image src="/assets/blog/independent-travel-china/cover.webp" alt="Travelers crossing a railway concourse in China" fill priority unoptimized sizes="100vw" /><div className="journey-hero-shade" /><nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><span>China Trip Checklist</span></nav><div className="journey-hero-copy shell"><div><p>THE CHINA TRIP CHECKLIST</p><h1>Ready for China, from the first decision to the first day.</h1><span>Entry rules. The right bookings. A working phone and a way to pay. Make the practical parts easier before you leave.</span><div className="journey-hero-actions"><a href="#decide" className="button journey-primary-action">START PREPARING</a><a href="#setup" className="journey-text-action">SET UP MY PHONE <b>↓</b></a></div></div></div></header>

    <nav className="journey-anchor-nav kit-stage-nav" aria-label="Preparation stages"><div className="shell"><div>{stages.map(stage => <a key={stage.id} href={`#${stage.id}`}>{stage.label}</a>)}<a href="#departure">04 · Before you fly</a></div><a href="#esim">INTERNET SETUP</a></div></nav>

    {stages.map(stage => <section key={stage.id} id={stage.id} className="kit-stage section"><div className="shell"><div className="kit-stage-heading"><span>YOUR PREPARATION PATH</span><h2>{stage.label}</h2><p>{stage.intro}</p></div><div className="kit-steps">{stage.steps.map(step => <article key={step.id} id={step.id} className={`kit-step ${step.id === "esim" || step.id === "vpn" ? "kit-connection-step" : ""}`}><span className="kit-step-number">{step.number}</span><div className="kit-step-copy"><h3>{step.title}</h3><p>{step.why}</p><p className="kit-task"><b>Do this:</b> {step.task}</p><ActionLink action={step.guide} /></div>{step.id === "esim" || step.id === "vpn" ? <div className="kit-options kit-connection-options"><p className="kit-options-heading">{step.id === "esim" ? "CHOOSE YOUR DATA PLAN" : "COMPARE VPN OPTIONS"}</p><div className="kit-connection-grid">{connectionOptions[step.id].map(option => <div className="kit-connection-card" key={option.name}><div className="kit-connection-card-top">{option.logo ? <Image src={option.logo} alt="" width={42} height={42} unoptimized /> : <span className="kit-logo-fallback" aria-hidden="true">A</span>}<h4>{option.name}</h4></div><p>{option.detail}</p><ActionLink action={option.action} primary /></div>)}</div><p className="kit-choice-note">Choose for your device, trip length and connection type. These are optional partner links, not a guarantee of service in every location.</p></div> : step.options?.length ? <div className="kit-options"><p className="kit-options-heading">TOOLS & OPTIONS</p>{step.options.map(option => <div className="kit-option" key={option.name}><div><h4>{option.name}</h4><p>{option.detail}</p></div><ActionLink action={option.action} primary={!!option.action.affiliate} /></div>)}</div> : <div className="kit-guide-note"><span>FREE GUIDE</span><p>Use the guide to check the details for your own trip.</p><ActionLink action={step.guide} /></div>}</article>)}</div></div></section>)}

    <section id="departure" className="kit-departure section"><div className="shell kit-departure-layout"><div><h2>Before you fly</h2><p>Tick off what applies to your trip. Review entry rules and bookings again close to departure.</p><div className="kit-offline"><h3>Keep these within reach</h3><p>Passport, visa or entry documents if required, first hotel address in Chinese, booking confirmations, insurance details, and your embassy or consulate contact.</p><p>For mainland China emergencies: police <b>110</b>, ambulance <b>120</b>, fire <b>119</b>. Language support may be limited.</p></div></div><PrepChecklist /></div></section>

    <section className="kit-next section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>AFTER THE PRACTICAL PREP</span><h2>Now think about the journey itself.</h2><p>Choose what you want to experience and how much time you want to give each place.</p></div><div className="kit-next-grid"><div className="kit-guides"><GuideCard guide={{ title: "Yunnan Travel Guide", excerpt: "See how Kunming, Dali, Shaxi and Lijiang fit together at an unhurried pace.", href: "/china-destinations/yunnan", image: "/home/hero.webp", readTime: "DESTINATION GUIDE" }} /><GuideCard guide={{ title: "Dali Travel Guide", excerpt: "Explore Erhai, the old town and Bai villages before you decide where to stay.", href: "/dali-travel-guide", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", readTime: "LOCAL GUIDE" }} /></div>{featuredJourney && <JourneyCard journey={{ title: featuredJourney.frontmatter.title, subtitle: "A slower route through Kunming, Dali, Shaxi and Lijiang, shaped with local support.", href: `/journeys/${featuredJourney.slug}`, image: featuredJourney.frontmatter.coverImage, destination: "PRIVATE YUNNAN JOURNEY", duration: featuredJourney.frontmatter.duration, fromPrice: `From ${formatPriceLabel(featuredJourney.frontmatter.fromPrice, featuredJourney.frontmatter.currency)} ${featuredJourney.frontmatter.priceBasis}` }} />}</div></div></section>

    <section className="journey-faq section kit-faq"><div className="narrow"><div className="section-heading"><h2>China trip preparation FAQs</h2></div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="kit-journey-cta"><div className="shell"><h2>Would you rather explore than coordinate every detail?</h2><p>Tell Joy your dates, interests and preferred pace. She can help shape a private Yunnan route and connect you with licensed local partners who arrange and operate it.</p><Link className="button button-light" href="https://wa.me/8618880441791?text=Hi%2C%20I%20used%20the%20China%20trip%20checklist%20and%20would%20like%20help%20planning%20a%20private%20Yunnan%20journey">ASK JOY ABOUT MY ROUTE</Link><Link href="/journeys">Explore private journeys →</Link></div></section>
    <p className="kit-disclosure shell">Some booking links on this page are affiliate links. If you buy through them, we may earn a commission at no extra cost to you. <Link href="/affiliate-disclosure">How our recommendations work</Link>.</p>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
  </main>;
}
