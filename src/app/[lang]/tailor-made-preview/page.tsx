import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { JourneyHero, JourneyFactCards } from "@/components/journey-landing";
import { RealJourneyEvidence } from "@/components/real-journey-evidence";
import { JourneyCard } from "@/components/journey-card";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { PreviewEnquiryForm } from "@/components/preview-enquiry-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import type { AppLocale } from "@/lib/i18n-seo";
import "./preview.css";

type Props = { params: Promise<{ lang: AppLocale }> };
export const metadata: Metadata = {
  title: "Private Yunnan Tours, Designed Around You — Preview",
  description: "Explore two ready-planned private Yunnan routes and tailor a longer journey. Tell Joy your trip length and group size to receive a suggested itinerary and initial price.",
  robots: { index: false, follow: false },
};

const routes = [
  { num: "01", title: "6-Day First Encounter", places: "6 DAYS · KUNMING → DALI · SHAXI · LIJIANG", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp", alt: "A stone-paved street in Shaxi", description: "Meet Bai artisans beside Erhai Lake, spend a quiet night in Shaxi’s old Tea Horse Road town, then give Jade Dragon Snow Mountain a full day — without rushing between stops.", best: "First-time visitors with limited time", price: "From US$680 per person", href: "/journeys/kunming-dali-shaxi-lijiang-6-days" },
  { num: "02", title: "8-Day Mountains & Ancient Towns", places: "8 DAYS · KUNMING · DALI · LIJIANG · TIGER LEAPING GORGE · SHANGRI-LA", image: "/assets/destinations/yunnan/tiger-leaping.webp", alt: "Mountain gorge in Yunnan", description: "Go from lakeside Dali and Lijiang’s old lanes to the dramatic road through Tiger Leaping Gorge. Continue into Shangri-La for Tibetan culture and a slower highland day.", best: "Travelers wanting Yunnan’s classic highlights", price: "From US$799 per person", href: "/journeys/kunming-dali-lijiang-shangri-la-private-tour" },
];

const faqs = [
  ["How many days do I need for Yunnan?", "Six days works well for Dali, Shaxi and Lijiang. Seven to eight days can include Tiger Leaping Gorge and Shangri-La; ten to twelve days gives you more time to explore at a comfortable pace."],
  ["How much does a private Yunnan tour cost?", "Our sample 6-day journey starts at US$680 per person and the 8-day journey starts at US$799 per person. These are starting prices, not fixed quotes. Final costs depend on season, hotel choice, group size and the confirmed inclusions."],
  ["Can I customize the 6-day or 8-day route?", "Yes. Add or remove destinations, adjust the pace, select hotels and choose experiences. We will explain what fits comfortably within your available days."],
  ["Is the journey completely private?", "Yes. Travel with your own partner, family or friends, without shared groups or mandatory shopping stops. Choose Chinese- or English-speaking service at no extra guide-language charge, with one dedicated driver-guide for the full journey. Your assigned guide and vehicle are confirmed before departure."],
  ["What is normally included in the quotation?", "The sample 6-day tour includes private transport, one driver-guide throughout, premium hotels with breakfast, second-class high-speed rail and listed attraction tickets. Lunches and dinners, international flights, travel insurance and personal expenses are not included. Your written quote specifies all services for your chosen route."],
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
    <JourneyHero title="Private Yunnan Tours, Designed Around You" eyebrow="TAILOR-MADE YUNNAN" image="/home/hero.webp" imageAlt="Yunnan's Jade Dragon Snow Mountain" description="Explore Dali, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La on a private journey shaped around your dates, interests and pace." primary={{href:"#plan",label:cta}} secondary={{href:"#routes",label:"Explore Route Ideas"}} price="6-Day Private Yunnan Tour · From US$680 per person" note="Based on two adults sharing one room. Final prices depend on travel dates, group size, hotels and confirmed services."/>
    <JourneyFactCards id="glance" title="At a glance" cards={[
      { icon:"calendar", title:"Flexible Duration", lines:["6–12 Days","A route shaped around your available time, interests and preferred pace."] },
      { icon:"route", title:"100% Tailor-Made & No Shopping", lines:["Just Your Group","Private travel shaped to your group, with no shared departures or compulsory shopping stops."] },
      { icon:"star", title:"One Guide, Your Language", lines:["Chinese or English Included","Choose your guide language at no extra charge; one dedicated driver-guide throughout."] },
      { icon:"note", title:"Transparent Booking", lines:["20% Deposit","Booking and refunds follow the agreed cancellation policy in your contract."] },
    ]} action={{href:"#plan",label:"Get My Route & Price"}} />
    <section className="section preview-fit"><div className="shell preview-two">
      <article><p className="kicker">YOUR KIND OF TRIP</p><h2>Who it's for</h2><p>For couples, families, friends and small private groups who want local guidance without joining a scheduled tour.</p><p>You do not need to know the exact route. A rough trip length and group size are enough.</p></article>
      <article><p className="kicker">SEASONAL ADVICE</p><h2>When to go</h2><p>March to May and September to November are generally the most comfortable periods for classic Dali, Lijiang and Shangri-La routes.</p><p>Summer is greener but wetter. Winter is quieter, with colder conditions at higher elevations.</p></article>
    </div></section>
    <section className="section preview-routes" id="routes"><div className="shell"><div className="preview-heading">
      <p className="kicker">A STARTING POINT, NOT A FIXED PACKAGE</p>
      <h2>Start with a Ready-Planned Yunnan Route</h2>
      <p>Explore two carefully planned journeys, then customize the route, pace and hotels around your trip.</p>
    </div>
    <div className="journeys-card-grid preview-reused-journeys">{routes.map(r =>
      <JourneyCard key={r.num} journey={{
        title: r.title, subtitle: r.description, href: r.href, image: r.image, imageAlt: r.alt,
        destination: r.places, fromPrice: r.price, features: [`Best for ${r.best}`],
        ctaLabel: r.num === "01" ? "View the 6-Day Journey" : "View the 8-Day Journey",
        secondaryHref: "#plan", secondaryLabel: "Customize This Route",
        trackingLocation: "preview_route_" + r.num,
      }} />
    )}</div>
    <p className="preview-price-note">Starting prices are per person, based on two adults sharing a room. Final prices vary by travel dates, group size, hotel selection and confirmed services.</p>
    </div>
    <div className="preview-longer-journey">
      <div className="shell preview-longer-inner">
        <div className="preview-longer-copy">
          <p className="kicker">NEED MORE TIME IN YUNNAN?</p>
          <h3>Planning a 10–12 Day Journey?</h3>
          <p>Explore Kunming, Dali, Shaxi, Lijiang and Shangri-La at a more comfortable pace, with extra time for local culture, photography, food or hiking.</p>
          <p>Share your trip length, group size and interests. Joy will suggest a suitable route and initial price range.</p>
        </div>
        <div className="preview-longer-action">
          <a className="button button-light" href="#plan" data-cta-location="preview_longer_journey">Design My Longer Yunnan Journey →</a>
        </div>
      </div>
    </div>
    </section>
    <RealJourneyEvidence />
    <section className="section preview-inclusions" id="included-excluded"><div className="shell">
      <div className="preview-heading"><p className="kicker">THE 6-DAY REFERENCE JOURNEY</p><h2>What’s Included — and What’s Not</h2><p>The same inclusions and exclusions listed on our 6-day journey page. For the 8-day route or custom plans, your written proposal confirms the exact services.</p></div>
      <div className="preview-inclusion-grid">
        <article><span className="journey-detail-label">INCLUDED IN THE 6-DAY TOUR</span><ul>
          <li>A private vehicle throughout the journey, including fuel, tolls, parking, and your driver’s meals and accommodation</li>
          <li>One Chinese- or English-speaking driver-guide for the whole journey, included at the same price</li>
          <li>Premium hotels throughout, with breakfast included</li>
          <li>High-speed rail tickets during the journey, in second class</li>
          <li>Entrance tickets for the sights listed in the itinerary</li>
        </ul></article>
        <article><span className="journey-detail-label">NOT INCLUDED</span><ul>
          <li>Lunch and dinner</li><li>International flights</li><li>Travel insurance</li><li>Personal expenses</li>
        </ul></article>
      </div>
      <p className="preview-inclusions-note">Chinese- or English-speaking driver-guide service is included at the same price, with one dedicated guide for your journey. All tour details are confirmed in the written proposal.</p>
    </div></section>
    <section className="section preview-custom"><div className="shell"><div className="preview-heading"><p className="kicker">TAILORED TO YOU</p><h2>Make the Journey Yours</h2></div><div className="preview-two">
    <article><h3>Route & Pace</h3><ul><li>Add or remove destinations</li><li>Spend longer in fewer places, such as an extra night in Dali or Lijiang</li><li>Choose gentler starts or fuller days</li><li>Adjust hiking and altitude exposure</li></ul></article>
    <article><h3>Hotels & Experiences</h3><ul><li>Comfortable, premium or characterful hotels, confirmed by name</li><li>Bai tie-dye workshops in Zhoucheng and a night in Shaxi</li><li>Local food, photography and countryside walks</li><li>Family-friendly arrangements</li><li>Dietary and mobility requirements</li></ul></article>
    </div></div></section>
    
    <JourneyFactCards id="why-travel" title="Local Planning. Licensed Delivery." cards={[
      { icon:"person", title:"Yunnan-rooted route planning", lines:["Route advice informed by local knowledge of seasons, travel times and the real pace between stops"] },
      { icon:"party", title:"Planning backed by local operations", lines:["Joy helps with the initial route; Yunnan Meizhen’s licensed team coordinates booking and delivery"] },
      { icon:"licence", title:"Licensed tour operator", lines:["Travel contract and payment with Yunnan Meizhen International Travel Agency","Permit L-YN-1017500"] },
      { icon:"note", title:"Confirmed before departure", lines:["Named hotels, guide-language choice and vehicle class agreed in writing","Local operations team coordinates pickups and logistics"] },
    ]} action={{href:"/licensed-operator",label:"Check our licensed operator"}} />
    <section className="section preview-process journey-support-flow"><div className="shell journey-section-layout"><header className="preview-heading"><p className="kicker">THREE SIMPLE STEPS</p><h2>How planning works</h2></header><div className="journey-support-grid">
      <article><span>01</span><h3>Share the basics</h3><p>Tell us your trip length, group size and places or experiences that interest you. Dates can follow later.</p></article>
      <article><span>02</span><h3>Receive a route and price</h3><p>Joy suggests a realistic route and an initial price range based on your trip length, group size and interests.</p></article>
      <article><span>03</span><h3>Adjust before booking</h3><p>Review changes to hotels, pace and experiences before booking; any change to included services or price is confirmed in writing.</p></article>
    </div><p className="preview-centered">There is no payment or booking commitment when requesting an initial proposal.</p></div></section>
    {/* Traveler testimonials are withheld on this preview until original sources and permission are verified. */}
    <section className="section preview-plan" id="plan"><div className="shell preview-plan-grid">
      <div className="preview-plan-joy"><div className="preview-joy-photo"><Image src="/brand/founder/portrait.webp" alt="Joy, founder of Hidden China Travel" fill sizes="(max-width:700px) 100vw, 42vw" /></div><p className="kicker">LOCAL PLANNING, LICENSED DELIVERY</p><h2>Get a Suggested Yunnan Route & Price</h2><p>You do not need a finished itinerary. Share your approximate number of days and group size, and we will suggest a realistic starting route and price range based on your interests, with bookings and on-the-ground arrangements coordinated by our licensed local team.</p><p><strong>Yunnan-based operations team</strong> · Chinese- or English-speaking service · Licensed local delivery</p><p className="preview-quiet">Prefer WhatsApp? <Link href={whatsapp} data-cta-location="preview_form_whatsapp">Chat with Joy →</Link></p></div>
      <PreviewEnquiryForm />
    </div></section>
    <section className="section preview-payment journey-support-flow"><div className="shell journey-section-layout">
      <header className="preview-heading"><p className="kicker">CLEAR TERMS, NO SURPRISES</p><h2>Clear Booking and Payment</h2></header>
      <div className="journey-support-grid">
        <article><span>01</span><h3>Review your proposal</h3><p>Check the written route, named hotels, inclusions, exclusions and total price before you commit.</p></article>
        <article><span>02</span><h3>Sign and confirm</h3><p>Sign the licensed travel agency’s contract. A 20% deposit is our usual arrangement, subject to the agreed written terms.</p></article>
        <article><span>03</span><h3>Complete the balance</h3><p>The remaining balance is normally paid after your first pickup, as specified in your travel contract.</p></article>
      </div>
      <p className="preview-centered">Your signed contract controls the payment schedule, cancellation terms and refunds.</p>
    </div></section>
    <section className="section journey-faq" id="questions"><div className="narrow"><h2>Frequently Asked Questions</h2>{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>Your Yunnan journey starts with a conversation.</h2><span>Tell us about your party and interests. Get a suggested route and initial price range, with no commitment to book.</span><a className="button button-light" href="#plan">Get a Suggested Route & Price</a></div></section>
    <MobileCtaBar whatsappHref={whatsapp} formHref="#plan" whatsappLabel="" formLabel="Get a Suggested Route & Price" formOnly formCtaLocation="preview_mobile_route_price" />
    <ContentFooter />
  </main>;
}
