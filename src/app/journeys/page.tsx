import type { Metadata } from "next";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { QuickAsk } from "@/components/quick-ask";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { getAllJourneys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Private Yunnan Journeys",
  description: "Explore private, slower-paced journeys through Yunnan with trusted local drivers, guides and personal planning support from Joy Liu.",
  alternates: { canonical: "https://hiddenchinatravel.com/journeys" },
};

function priceLabel(value: number, currency: string, basis: string) {
  if (!Number.isFinite(value) || value <= 0) return "Request a tailored quote";
  const prefix = currency === "USD" ? "US$" : currency === "CNY" ? "¥" : `${currency} `;
  return `From ${prefix}${new Intl.NumberFormat("en-US").format(value)} ${basis}`;
}

export default function JourneysPage() {
  const journeys = getAllJourneys();
  return <main>
    <SiteHeader />
    <header className="journeys-hero"><div className="narrow"><p>PRIVATE JOURNEYS THROUGH YUNNAN</p><h1>See less. Feel more.</h1><span>Thoughtful routes for travelers who want local context, an unhurried pace and support without the feeling of a conventional group tour.</span></div></header>
    <section className="journeys-list section"><div className="shell"><div className="section-heading"><h2>Private Yunnan journeys</h2><p>Start with one of our signature journeys, then adjust the dates, pace and details around your party.</p></div><div className="journeys-card-grid">{journeys.map((journey) => <JourneyCard key={journey.slug} priority={journey.frontmatter.featured} journey={{
      title: journey.frontmatter.shortTitle,
      subtitle: journey.frontmatter.excerpt,
      href: `/journeys/${journey.slug}`,
      image: journey.frontmatter.coverImage,
      imageAlt: journey.frontmatter.title,
      destination: journey.frontmatter.route,
      duration: journey.frontmatter.duration,
      fromPrice: priceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency, journey.frontmatter.priceBasis),
    }} />)}</div>
      <aside className="journeys-tailor-made" aria-labelledby="journeys-tailor-made-title">
        <div><span>PERSONAL PLANNING SERVICE</span><h2 id="journeys-tailor-made-title">A journey designed around you.</h2></div>
        <div><p>None of these routes quite fit? Start with your own dates, interests, preferred pace and comfort level. Joy will discuss the possibilities with you before a licensed local partner prepares the proposal and operates the trip.</p><ul><li>Your preferred duration and route</li><li>Private transport, guiding and accommodation</li><li>A written itinerary and tailored quote</li></ul><Link href="/custom-china-tour" data-cta-location="journeys_custom_service" className="button button-light">DESIGN YOUR JOURNEY</Link></div>
      </aside>
    </div></section>
    <section className="journeys-philosophy section-sand"><div className="shell"><h2>Not a checklist. A journey shaped around you.</h2><div>{["Private travel with your own party", "Local drivers and guides where they matter", "No mandatory shopping stops", "A licensed local partner for contracting and delivery"].map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}</div></div></section>
    <QuickAsk source="/journeys" sourceTitle="Private Yunnan journeys" intent="trip" />
    <ContentFooter />
  </main>;
}

