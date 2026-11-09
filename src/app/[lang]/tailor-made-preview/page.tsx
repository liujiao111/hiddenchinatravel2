import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { JourneyHero, JourneyFactCards } from "@/components/journey-landing";
import { CompactJourneyServiceProof } from "@/components/compact-journey-service-proof";
import { JourneyCard } from "@/components/journey-card";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { PreviewEnquiryForm } from "@/components/preview-enquiry-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import type { AppLocale } from "@/lib/i18n-seo";
import "./preview.css";

type Props = { params: Promise<{ lang: AppLocale }> };
export const metadata: Metadata = {
  title: "Private Yunnan Tours, Designed Around You — Preview",
  description: "Explore three private Yunnan route ideas. Tell Joy your trip length and group size to receive a suggested itinerary and initial price.",
  robots: { index: false, follow: false },
};

const routes = [
  { num: "01", title: "6-Day First Encounter", places: "Dali · Shaxi · Lijiang", duration: "6 DAYS", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp", alt: "A stone-paved street in Shaxi", description: "Erhai Lake, Bai culture, a night in Shaxi and a full day at Jade Dragon Snow Mountain.", best: "First-time visitors with limited time", price: "From US$680 per person", href: "/journeys/kunming-dali-shaxi-lijiang-6-days" },
  { num: "02", title: "8-Day Mountains & Ancient Towns", places: "Dali · Lijiang · Tiger Leaping Gorge · Shangri-La", duration: "8 DAYS", image: "/assets/destinations/yunnan/tiger-leaping.webp", alt: "Mountain gorge in Yunnan", description: "A classic western Yunnan route combining ancient towns, mountain landscapes, Tiger Leaping Gorge and the Tibetan culture of Shangri-La.", best: "Travelers wanting Yunnan's classic highlights", price: "Request an initial price", href: "/journeys/kunming-dali-lijiang-shangri-la-private-tour" },
  { num: "03", title: "10–12 Day Yunnan in Depth", places: "Kunming · Dali · Shaxi · Lijiang · Shangri-La", duration: "10–12 DAYS", image: "/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", alt: "Erhai Lake and Cangshan in Dali", description: "Stay overnight on Shaxi’s Tea Horse Road, explore Bai traditions in Dali, and allow more time for food, photography and gentle walks.", best: "Travelers who prefer depth over rushing", price: "Tailor-made quotation", href: "#plan" },
];

const faqs = [
  ["How many days do I need for Yunnan?", "Six days works well for Dali, Shaxi and Lijiang. Seven to eight days can include Tiger Leaping Gorge and Shangri-La; ten to twelve days gives you more time to explore at a comfortable pace."],
  ["How much does a private Yunnan tour cost?", "Our published sample 6-day journey starts at US$680 per person, based on two adults sharing one room. For longer or 8-day journeys, request an initial price. Final prices vary by season, hotel choice, group size and inclusions."],
  ["Can I customize the 6-day or 8-day route?", "Yes. Add or remove destinations, adjust the pace, select hotels and choose experiences. We will explain what fits comfortably within your available days."],
  ["Is the journey completely private?", "Yes. Travel with your own partner, family or friends rather than joining a scheduled group departure. The vehicle and driver-guide are arranged for your party, though the assigned person or vehicle may change between destinations according to the confirmed plan."],
  ["What is normally included in the quotation?", "Your written quotation identifies the named hotels and room types, vehicle arrangements, driver-guide language and service hours, and the tickets, trains and meals actually included. It also lists exclusions. The package is only confirmed after you review and approve it."],
  ["What happens if the weather or train times change?", "Joy and the local team coordinate changes to the agreed itinerary, including revised pickups or alternate visits where practical. Weather-sensitive sites and train tickets depend on availability. Proposed changes, charges and any refunds are discussed before confirmation."],
  ["Do I need confirmed dates before enquiring?", "No. Your group size and approximate trip length are enough to get started."],
  ["How does booking and payment work?", "Review the written itinerary and quotation first, then sign the licensed agency's travel contract. The usual arrangement is a 20% deposit and the remaining balance after your first pickup, subject to your agreed written terms."],
];

const cta = "Get a Suggested Route & Price";
export default async function TailorMadePreview({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const whatsapp = buildWhatsAppUrl(undefined, lang);

  return <main className="tailor-preview">
    <SiteHeader conversion cta={{ href: "#plan", label: cta }} />
    <JourneyHero title="Private Yunnan Tours, Designed Around You" eyebrow="TAILOR-MADE YUNNAN" image="/home/hero.webp" imageAlt="Yunnan's Jade Dragon Snow Mountain" description="Explore Dali, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La on a private journey shaped around your dates, interests and pace." primary={{href:"#plan",label:cta}} secondary={{href:"#routes",label:"Explore Route Ideas"}} note="Sample 6-day private journeys from US$680 per person. Based on two adults sharing one room. Final pricing depends on season, route, hotels and included services." includes={["A route designed around your available time","Your own English-speaking driver-guide and private vehicle","Hotels and experiences matched to your travel style","No fixed departures, mixed groups or shopping stops"]}/>
    <JourneyFactCards id="glance" title="At a glance" cards={[
      { icon:"calendar",title:"Flexible duration",lines:["6–12 Days","From a short introduction to a more complete journey"] },
      { icon:"party",title:"Fully private",lines:["Your Own Journey","With your partner, family or friends"] },
      { icon:"pin",title:"Local planning",lines:["Planned in Yunnan","Routes, seasons and travel time explained"] },
      { icon:"note",title:"Clear Proposal",lines:["Route, selected hotels, inclusions and total price confirmed in writing before booking"] },
    ]} action={{href:"#plan",label:"Get My Route & Price"}} />
    <section className="section preview-fit"><div className="shell preview-two">
      <article><p className="kicker">YOUR KIND OF TRIP</p><h2>Who it's for</h2><p>For couples, families, friends and small private groups who want local guidance without joining a scheduled tour.</p><p>You do not need to know the exact route. A rough trip length and group size are enough.</p></article>
      <article><p className="kicker">SEASONAL ADVICE</p><h2>When to go</h2><p>March to May and September to November are generally the most comfortable periods for classic Dali, Lijiang and Shangri-La routes.</p><p>Summer is greener but wetter. Winter is quieter, with colder conditions at higher elevations.</p></article>
    </div></section>
    <section className="section preview-routes" id="routes"><div className="shell"><div className="preview-heading"><p className="kicker">A STARTING POINT, NOT A FIXED PACKAGE</p><h2>Three ways to explore Yunnan</h2><p>Pick a route you like, then make it yours.</p></div>
    <div className="journeys-card-grid preview-reused-journeys">{routes.map(r => <div className="preview-reused-journey" key={r.num}>
      <JourneyCard journey={{ title: r.title, subtitle: r.description, href: r.href, image: r.image, imageAlt: r.alt, duration: r.duration, destination: r.places, fromPrice: r.price, features: [`Best for: ${r.best}`], ctaLabel: r.num==="01" ? "View the 6-Day Journey" : r.num==="02" ? "View the 8-Day Journey" : "Design a Longer Journey", trackingLocation: "preview_route_"+r.num }} />
      {r.num!=="03" ? <a className="preview-customize-route" href="#plan">Customize This Route →</a> : null}
    </div>)}</div>
    <p className="preview-price-note">The sample 6-day price is based on two adults sharing one room. Final prices depend on season, route, group size, selected hotels and included services. The written proposal confirms exactly what is included.</p>
    <div className="preview-route-help"><h3>Not sure which route fits your trip?</h3><p>Tell us your approximate duration and group size. Joy will suggest a realistic route for your season and interests.</p><a className="button button-blue" href="#plan">Help Me Choose</a></div>
    </div></section>
    <JourneyFactCards id="what-to-expect" title="A Private Journey, Thoughtfully Arranged" cards={[
      { icon: "route", title: "Your route, professionally planned", lines: ["A realistic day-by-day plan for your dates", "Travel time, altitude and sightseeing pace considered"] },
      { icon: "person", title: "Private driver-guide service", lines: ["English-speaking service confirmed for your dates", "Driving, pickups, local context and itinerary coordination", "Specialist attraction guides quoted separately if needed"] },
      { icon: "calendar", title: "Transport & comfortable stays", lines: ["Private five- or seven-seat vehicle as suitable", "Selected hotels, room types and breakfasts named in your proposal"] },
      { icon: "note", title: "Clear arrangements before booking", lines: ["Written total price, inclusions and exclusions", "Tickets, trains, meals and upgrades listed only when included"] },
    ]} />
    <section className="section preview-custom"><div className="shell"><div className="preview-heading"><p className="kicker">TAILORED TO YOU</p><h2>Make the Journey Yours</h2></div><div className="preview-two">
    <article><h3>Route & Pace</h3><ul><li>Add or remove destinations</li><li>Spend longer in fewer places, such as an extra night in Dali or Lijiang</li><li>Choose gentler starts or fuller days</li><li>Adjust hiking and altitude exposure</li></ul></article>
    <article><h3>Hotels & Experiences</h3><ul><li>Comfortable, premium or characterful hotels, confirmed by name</li><li>Bai tie-dye workshops in Zhoucheng and a night in Shaxi</li><li>Local food, photography and countryside walks</li><li>Family-friendly arrangements</li><li>Dietary and mobility requirements</li></ul></article>
    </div></div></section>
    <CompactJourneyServiceProof />
    <JourneyFactCards id="why-travel" title="Why travel with us" cards={[
      { icon:"person", title:"Planned by a Yunnan local", lines:["Born in Yunnan, Joy plans routes with practical advice on seasons, travel time and pace"] },
      { icon:"party", title:"One contact throughout", lines:["Speak with Joy from your first enquiry through planning and your journey"] },
      { icon:"licence", title:"Licensed local operator", lines:["Contract and payment through Yunnan Meizhen International Travel Agency","Permit L-YN-1017500"] },
      { icon:"note", title:"Everything in writing", lines:["Route, hotels, inclusions, exclusions and total price before you decide"] },
    ]} action={{href:"/licensed-operator",label:"View licence and booking protection"}} />
    <section className="section preview-process journey-support-flow"><div className="shell journey-section-layout"><header className="preview-heading"><p className="kicker">THREE SIMPLE STEPS</p><h2>How planning works</h2></header><div className="journey-support-grid">
      <article><span>01</span><h3>Share the basics</h3><p>Tell us your trip length, group size and places or experiences that interest you. Dates can follow later.</p></article>
      <article><span>02</span><h3>Receive a route and price</h3><p>Joy suggests a realistic route and an initial price range based on your trip length, group size and interests.</p></article>
      <article><span>03</span><h3>Adjust before booking</h3><p>Review changes to hotels, pace and experiences before booking; any change to included services or price is confirmed in writing.</p></article>
    </div><p className="preview-centered">There is no payment or booking commitment when requesting an initial proposal.</p></div></section>
    {/* Traveler testimonials are withheld on this preview until original sources and permission are verified. */}
    <section className="section preview-plan" id="plan"><div className="shell preview-plan-grid">
      <div className="preview-plan-joy"><div className="preview-joy-photo"><Image src="/brand/founder/portrait.webp" alt="Joy, founder of Hidden China Travel" fill sizes="(max-width:700px) 100vw, 42vw" /></div><p className="kicker">PLAN DIRECTLY WITH JOY</p><h2>Get a Suggested Yunnan Route & Price</h2><p>You do not need a finished itinerary. Share your approximate number of days and group size, and Joy will suggest a realistic starting route and price range based on your interests.</p><p><strong>Based in Kunming</strong> · English-language planning and local support</p><p className="preview-quiet">Prefer WhatsApp? <Link href={whatsapp} data-cta-location="preview_form_whatsapp">Chat with Joy →</Link></p></div>
      <PreviewEnquiryForm />
    </div></section>
    <section className="section preview-payment"><div className="shell"><h2>Clear Booking and Payment</h2><div className="preview-payment-grid"><p>Review the written itinerary and quotation before booking.</p><p>Sign a travel contract with the licensed agency.</p><p>Pay a 20% deposit to confirm arrangements.</p><p>Pay the remaining balance after your first pickup.</p></div><small>Booking and refund terms are confirmed in your written contract.</small></div></section>
    <section className="section journey-faq" id="questions"><div className="narrow"><h2>Frequently Asked Questions</h2>{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>Your Yunnan journey starts with a conversation.</h2><span>Share your trip length and ideas. Joy will suggest a route and initial price.</span><a className="button button-light" href="#plan">Get a Suggested Route & Price</a></div></section>
    <MobileCtaBar whatsappHref={whatsapp} formHref="#plan" whatsappLabel="" formLabel="Get a Suggested Route & Price" formOnly formCtaLocation="preview_mobile_route_price" />
    <ContentFooter />
  </main>;
}
