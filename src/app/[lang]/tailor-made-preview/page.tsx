import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { JourneyHero, JourneyFactCards } from "@/components/journey-landing";
import { Testimonials } from "@/components/testimonials";
import { PreviewEnquiryForm } from "@/components/preview-enquiry-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getSelectedTestimonials } from "@/lib/testimonials";
import type { AppLocale } from "@/lib/i18n-seo";
import "./preview.css";

type Props = { params: Promise<{ lang: AppLocale }> };
export const metadata: Metadata = {
  title: "Private Yunnan Tours, Designed Around You — Preview",
  description: "Explore three private Yunnan route ideas. Tell Joy your dates, trip length and group size to receive a suggested itinerary and initial price.",
  robots: { index: false, follow: false },
};

const routes = [
  { num: "01", title: "6-Day First Encounter", places: "Dali · Shaxi · Lijiang", duration: "6 DAYS", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp", alt: "A stone-paved street in Shaxi", description: "Erhai Lake, Bai culture, a night in Shaxi and a full day at Jade Dragon Snow Mountain.", best: "First-time visitors with limited time", price: "From US$680 per person", href: "/journeys/kunming-dali-shaxi-lijiang-6-days" },
  { num: "02", title: "8-Day Mountains & Ancient Towns", places: "Dali · Lijiang · Tiger Leaping Gorge · Shangri-La", duration: "8 DAYS", image: "/assets/destinations/yunnan/tiger-leaping.webp", alt: "Mountain gorge in Yunnan", description: "More time for mountain landscapes, old towns and Tibetan culture, with a private guide.", best: "Travelers wanting Yunnan's classic highlights", price: "From US$799 per person", href: "/journeys/kunming-dali-lijiang-shangri-la-private-tour" },
  { num: "03", title: "10–12 Day Yunnan in Depth", places: "Kunming · Dali · Shaxi · Lijiang · Shangri-La", duration: "10–12 DAYS", image: "/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp", alt: "Erhai Lake and Cangshan in Dali", description: "Time for culture, photography, food, hiking and quieter countryside experiences.", best: "Travelers who prefer depth over rushing", price: "Tailor-made quotation", href: "#plan" },
];

const faqs = [
  ["How many days do I need for Yunnan?", "Six days works well for Dali, Shaxi and Lijiang. Seven to eight days can include Tiger Leaping Gorge and Shangri-La; ten to twelve days gives you more time to explore at a comfortable pace."],
  ["How much does a private Yunnan tour cost?", "Our published sample 6-day journey starts at US$680 per person, based on two adults sharing one room. The published 8-day journey starts at US$799 per person on the same basis. Final prices vary by season, hotel choice, group size and inclusions."],
  ["Can I customize the 6-day or 8-day route?", "Yes. Add or remove destinations, adjust the pace, select hotels and choose experiences. We will explain what fits comfortably within your available days."],
  ["Is the journey completely private?", "Yes. Travel with your own partner, family or friends rather than joining a scheduled group departure. The vehicle and driver-guide are arranged for your party."],
  ["What is normally included in the quotation?", "Your written quotation lists hotels, transportation, guide arrangements, attraction tickets, any included train tickets and meals, plus exclusions. The package is only confirmed after you review and approve it."],
  ["Do I need confirmed dates before enquiring?", "No. An approximate month, number of travelers and likely trip length are enough to get started."],
  ["How does booking and payment work?", "Review the written itinerary and quotation first, then sign the licensed agency's travel contract. The usual arrangement is a 20% deposit and the remaining balance after your first pickup, subject to your agreed written terms."],
];

const cta = "Get a Suggested Route & Price";
export default async function TailorMadePreview({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const whatsapp = buildWhatsAppUrl(undefined, lang);
  const reviews = getSelectedTestimonials("en").slice(0, 3);
  return <main className="tailor-preview">
    <SiteHeader conversion cta={{ href: "#plan", label: cta }} />
    <JourneyHero title="Private Yunnan Tours, Designed Around You" eyebrow="TAILOR-MADE YUNNAN" image="/home/hero.webp" imageAlt="Yunnan's Jade Dragon Snow Mountain" description="Explore Dali, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La on a private journey shaped around your dates, interests and pace." primary={{href:"#plan",label:cta}} secondary={{href:"#routes",label:"Explore Route Ideas"}} note="Sample 6-day journeys from US$680 per person · based on two adults sharing a room." includes={["A route designed around your available time","Your own driver-guide and private vehicle","Flexible pace, hotels and experiences","No group departures or shopping stops"]} chat={{href:whatsapp,label:"Prefer WhatsApp? Chat with Joy"}}/>
    <JourneyFactCards id="glance" title="At a glance" cards={[
      { icon:"calendar",title:"Flexible duration",lines:["6–12 Days","From a short introduction to a more complete journey"] },
      { icon:"party",title:"Fully private",lines:["Your Own Journey","With your partner, family or friends"] },
      { icon:"pin",title:"Local planning",lines:["Planned in Yunnan","Routes, seasons and travel time explained"] },
      { icon:"note",title:"Initial quotation",lines:["Clear Before Booking","Named hotels, inclusions and total price in writing"] },
    ]} />
    <section className="section preview-fit"><div className="shell preview-two">
      <article><p className="kicker">YOUR KIND OF TRIP</p><h2>Who it's for</h2><p>For couples, families, friends and small private groups who want local guidance without joining a scheduled tour.</p><p>You do not need to know the exact route. An approximate month, trip length and group size are enough.</p></article>
      <article><p className="kicker">SEASONAL ADVICE</p><h2>When to go</h2><p>March to May and September to November are generally the most comfortable periods for classic Dali, Lijiang and Shangri-La routes.</p><p>Summer is greener but wetter. Winter is quieter, with colder conditions at higher elevations.</p></article>
    </div></section>
    <section className="section preview-routes" id="routes"><div className="shell"><div className="preview-heading"><p className="kicker">A STARTING POINT, NOT A FIXED PACKAGE</p><h2>Three ways to explore Yunnan</h2><p>Pick a route you like, then make it yours.</p></div>
    <div className="preview-route-grid">{routes.map(r=><article className="preview-route" key={r.num}>
      <div className="preview-route-image"><Image src={r.image} alt={r.alt} fill sizes="(max-width: 800px) 100vw, 33vw" /><span>{r.duration}</span></div>
      <div className="preview-route-body"><small>{r.num} / ROUTE IDEA</small><h3>{r.title}</h3><p className="preview-places">{r.places}</p><p>{r.description}</p><p className="preview-best"><strong>Best for:</strong> {r.best}</p><strong className="preview-price">{r.price}</strong><div className="preview-route-actions"><Link href={r.href} className="button button-blue">{r.num==="01"?"View the 6-Day Journey":r.num==="02"?"View the 8-Day Journey":"Design a Longer Journey"}</Link>{r.num!=="03"?<a href="#plan">Customize This Route →</a>:null}</div></div>
    </article>)}</div>
    <p className="preview-price-note">Sample prices are per person for two adults sharing one room; longer routes and final prices depend on season, group size, hotels and services.</p>
    <div className="preview-route-help"><h3>Not sure which route fits your trip?</h3><p>Tell us your approximate duration and group size. Joy will suggest a realistic route for your season and interests.</p><a className="button button-blue" href="#plan">Help Me Choose</a></div>
    </div></section>
    <section className="section preview-custom"><div className="shell"><div className="preview-heading"><p className="kicker">TAILORED TO YOU</p><h2>Make the Journey Yours</h2></div><div className="preview-two">
    <article><h3>Route & Pace</h3><ul><li>Add or remove destinations</li><li>Spend longer in fewer places</li><li>Choose gentler starts or fuller days</li><li>Adjust hiking and altitude exposure</li></ul></article>
    <article><h3>Hotels & Experiences</h3><ul><li>Comfortable, premium or character hotels</li><li>Food, photography and cultural experiences</li><li>Family-friendly arrangements</li><li>Dietary and mobility requirements</li></ul></article>
    </div></div></section>
    <section className="section preview-trust"><div className="shell"><div className="preview-heading"><p className="kicker">LOCAL KNOWLEDGE, CLEAR ARRANGEMENTS</p><h2>Why travel with us</h2></div><div className="preview-trust-grid">
      <article><span>01</span><h3>Planned by a Yunnan local</h3><p>Born in Yunnan, Joy plans routes with practical advice on season, travel time and pace.</p></article>
      <article><span>02</span><h3>One contact throughout</h3><p>Speak with Joy from your first enquiry through planning and your journey.</p></article>
      <article><span>03</span><h3>Licensed local operator</h3><p>Your contract and payment are handled by Yunnan Meizhen International Travel Agency, permit L-YN-1017500.</p></article>
      <article><span>04</span><h3>Everything in writing</h3><p>Route, hotels, inclusions, exclusions and total price before you decide.</p></article>
    </div><p className="preview-trust-link"><Link href="/about-us">View licence and booking protection →</Link></p></div></section>
    <section className="section preview-process"><div className="shell"><div className="preview-heading"><p className="kicker">THREE SIMPLE STEPS</p><h2>How planning works</h2></div><div className="preview-steps">
      <article><span>01</span><h3>Share the basics</h3><p>Approximate month, trip length, group size and places that interest you.</p></article>
      <article><span>02</span><h3>Receive a route and price</h3><p>Joy suggests a realistic itinerary and an initial price based on your plans.</p></article>
      <article><span>03</span><h3>Adjust before booking</h3><p>Change the route, hotels, pace or experiences until the plan fits.</p></article>
    </div><p className="preview-centered">There is no payment or booking commitment when requesting an initial proposal.</p></div></section>
    {reviews.length>0?<Testimonials items={reviews} eyebrow="TRAVELER STORIES" heading="What Travelers Remember" intro="Experiences shared by travelers who explored Yunnan with our local team." />:null}
    <section className="preview-host"><div className="preview-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy, founder of Hidden China Travel" fill sizes="(max-width:800px) 100vw, 50vw" /></div><div className="preview-host-copy"><p className="kicker">YOUR LOCAL TRAVEL PLANNER</p><h2>Plan Directly with Joy</h2><p>You do not need a finished itinerary before contacting us.</p><p>Share your approximate travel month, number of days and group size. Joy will help you decide which places fit comfortably, what can realistically be included and how to tailor the journey around your interests.</p><p><strong>Based in Kunming</strong> · English-language planning and local support</p><a href="#plan" className="button button-blue">Get a Suggested Route & Price</a></div></section>
    <section className="section preview-plan" id="plan"><div className="shell preview-plan-grid"><div><p className="kicker">PLAN WITH JOY</p><h2>Get a Suggested Yunnan Route & Price</h2><p>An approximate plan is enough. Joy will use these details to recommend a suitable starting route and initial price range.</p><p className="preview-quiet">Prefer WhatsApp? <Link href={whatsapp} data-cta-location="preview_form_whatsapp">Send Joy the same details here →</Link></p></div><PreviewEnquiryForm /></div></section>
    <section className="section preview-payment"><div className="shell"><h2>Clear Booking and Payment</h2><div className="preview-payment-grid"><p>Review the written itinerary and quotation before booking.</p><p>Sign a travel contract with the licensed agency.</p><p>Pay a 20% deposit to confirm arrangements.</p><p>Pay the remaining balance after your first pickup.</p></div><small>Booking and refund terms are confirmed in your written contract.</small></div></section>
    <section className="section journey-faq" id="questions"><div className="narrow"><h2>Frequently Asked Questions</h2>{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>Your Yunnan journey starts with a conversation.</h2><span>Share your dates and ideas. Joy will suggest a route and initial price.</span><a className="button button-light" href="#plan">Get a Suggested Route & Price</a></div></section>
    <a className="preview-sticky-cta" href="#plan">Get a Suggested Route & Price →</a>
    <ContentFooter />
  </main>;
}
