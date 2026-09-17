import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { PrepChecklist } from "@/components/survival-kit/prep-checklist";
import "./survival-kit.css";

export const metadata: Metadata = {
  title: "China Trip Preparation Checklist (2026): Visa, eSIM, Payments & Bookings",
  description: "Prepare for your China trip in order: check entry rules, book essentials, set up data and payments, then save an arrival checklist. Practical guides and optional booking links.",
  alternates: { canonical: "/survival-kit" },
  openGraph: { title: "China Trip Preparation Checklist | Hidden China Travel", description: "The practical steps to sort before you land in China.", url: "/survival-kit", type: "website" },
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
  { id: "setup", label: "03 · Set up your phone", intro: "Do these while your familiar internet connection and card support are available.", steps: [
    { number: "05", id: "internet", title: "Make a connection plan", why: "An eSIM or roaming plan can provide data on arrival. Check device compatibility and coverage; a travel eSIM generally does not provide a mainland phone number. A VPN may help on local Wi-Fi or a local SIM, but availability varies.", task: "Install the eSIM before departure and test any VPN you plan to use.", guide: { label: "Compare China eSIM options", href: "/best-esim-for-china-travel" }, options: [
      { name: "Airalo eSIM", detail: "An app-based travel data option; compare its actual plan with your trip length.", action: { label: "Explore Airalo", href: "/go/airalo", affiliate: true } },
      { name: "Trip.com eSIM", detail: "Another data option worth comparing by allowance and validity.", action: { label: "Explore Trip.com eSIM", href: "/go/trip-esim", affiliate: true } },
      { name: "ExpressVPN", detail: "An optional VPN for local Wi-Fi or a local SIM. Read the guide before choosing.", action: { label: "Explore ExpressVPN", href: "/go/expressvpn", affiliate: true } },
      { name: "NordVPN", detail: "Another option to compare; connections can vary by network and location.", action: { label: "Explore NordVPN", href: "/go/nordvpn", affiliate: true } },
      { name: "Not sure you need a VPN?", detail: "Compare roaming, travel eSIMs and local networks before buying another subscription.", action: { label: "Read the VPN guide", href: "/do-you-need-vpn-china" } },
    ] },
    { number: "06", id: "payment", title: "Prepare two ways to pay", why: "Set up Alipay with your own passport and card before leaving. WeChat Pay or a little cash can be a useful backup if verification or a transaction fails.", task: "Complete verification and try a small payment when practical.", guide: { label: "Set up Alipay", href: "/alipay-for-foreigners-china" }, options: [{ name: "Payment backup", detail: "Know the common failure points before you arrive.", action: { label: "Read payment troubleshooting", href: "/why-your-payment-fails-in-china" } }] },
    { number: "07", id: "maps", title: "Save your first destination", why: "Install a map app that works well in mainland China. Save the hotel and arrival station in both English and Chinese.", task: "Open Amap, search for your hotel and keep a screenshot of the address.", guide: { label: "Amap and navigation guide", href: "/google-maps-china-not-working" } },
  ] },
];

function ActionLink({ action, primary = false }: { action: Action; primary?: boolean }) {
  return <Link href={action.href} className={primary ? "button button-green" : "kit-text-link"} {...(action.affiliate ? { rel: "sponsored nofollow" } : {})}>{action.label}<span aria-hidden="true"> →</span></Link>;
}

export default function SurvivalKitPage() {
  return <main><SiteHeader />
    <header className="kit-hero"><div className="kit-hero-image"><Image src="/assets/blog/independent-travel-china/cover.webp" alt="Travelers in a Chinese railway station" fill priority sizes="(max-width: 800px) 100vw, 45vw" /></div><div className="kit-hero-copy"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span> / </span>China trip checklist</nav><h1>Get ready for China, one step at a time.</h1><p>Start with entry rules and your route. Then book what matters, set up your phone, and save what you need for arrival.</p><a href="#decide" className="button button-green">START THE CHECKLIST</a><a href="#departure" className="kit-hero-jump">Already booked? Jump to departure checks →</a></div></header>

    <nav className="kit-stage-nav" aria-label="Preparation stages"><div className="shell">{stages.map(stage => <a key={stage.id} href={`#${stage.id}`}>{stage.label}</a>)}<a href="#departure">04 · Before you fly</a></div></nav>

    {stages.map(stage => <section key={stage.id} id={stage.id} className="kit-stage section"><div className="shell"><div className="kit-stage-heading"><h2>{stage.label}</h2><p>{stage.intro}</p></div><div className="kit-steps">{stage.steps.map(step => <article key={step.id} id={step.id} className="kit-step"><span className="kit-step-number">{step.number}</span><div className="kit-step-copy"><h3>{step.title}</h3><p>{step.why}</p><p className="kit-task"><b>Do this:</b> {step.task}</p><ActionLink action={step.guide} /></div>{step.options?.length ? <div className="kit-options"><p className="kit-options-heading">TOOLS & OPTIONS</p>{step.options.map(option => <div className="kit-option" key={option.name}><div><h4>{option.name}</h4><p>{option.detail}</p></div><ActionLink action={option.action} primary={!!option.action.affiliate} /></div>)}</div> : <div className="kit-guide-note"><span>FREE GUIDE</span><p>Use the guide to check the details for your own trip.</p><ActionLink action={step.guide} /></div>}</article>)}</div></div></section>)}

    <section id="departure" className="kit-departure section"><div className="shell kit-departure-layout"><div><h2>Before you fly</h2><p>Tick off what applies to your trip. Review entry rules and bookings again close to departure.</p><div className="kit-offline"><h3>Keep these within reach</h3><p>Passport, visa or entry documents if required, first hotel address in Chinese, booking confirmations, insurance details, and your embassy or consulate contact.</p><p>For mainland China emergencies: police <b>110</b>, ambulance <b>120</b>, fire <b>119</b>. Language support may be limited.</p></div></div><PrepChecklist /></div></section>

    <section className="kit-next section"><div className="shell"><div className="section-heading"><h2>Now think about the journey itself</h2><p>Once the essentials are handled, spend your energy on where you want to go and how you want to feel along the way.</p></div><div className="kit-next-grid"><Link href="/china-destinations/yunnan"><span>START WITH THE PLACE</span><h3>Explore Yunnan</h3><p>Get to know Dali, Shaxi, Lijiang and a route that leaves room to linger.</p><b>READ THE YUNNAN GUIDE →</b></Link><Link href="/dali-travel-guide"><span>GO DEEPER</span><h3>Plan your time in Dali</h3><p>Find a place to stay, decide what to see and leave time for the quieter corners.</p><b>READ THE DALI GUIDE →</b></Link><Link href="/journeys/kunming-dali-shaxi-lijiang-6-days"><span>TRAVEL WITH LOCAL SUPPORT</span><h3>A six-day private Yunnan journey</h3><p>See a paced route through Kunming, Dali, Shaxi and Lijiang with local partners.</p><b>EXPLORE THE JOURNEY →</b></Link></div></div></section>

    <section className="kit-journey-cta"><div className="shell"><h2>Would you rather explore than coordinate every detail?</h2><p>Tell Joy your dates, interests and preferred pace. She can help shape a private Yunnan route and connect you with licensed local partners who arrange and operate it.</p><Link className="button button-light" href="https://wa.me/8618880441791?text=Hi%2C%20I%20used%20the%20China%20trip%20checklist%20and%20would%20like%20help%20planning%20a%20private%20Yunnan%20journey">ASK JOY ABOUT MY ROUTE</Link><Link href="/journeys">Explore private journeys →</Link></div></section>
    <p className="kit-disclosure shell">Some booking links on this page are affiliate links. If you buy through them, we may earn a commission at no extra cost to you. <Link href="/affiliate-disclosure">How our recommendations work</Link>.</p>
    <ContentFooter />
  </main>;
}
