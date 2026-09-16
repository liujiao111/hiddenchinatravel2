import type { Metadata } from "next";
import { ContentFooter } from "@/components/content-footer";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { getAllJourneys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Private Yunnan Journeys",
  description: "Explore private, slower-paced journeys through Yunnan with trusted local drivers, guides and personal planning support from Joy Liu.",
  alternates: { canonical: "https://hiddenchinatravel.com/journeys" },
};

function priceLabel(value: number, currency: string, basis: string) {
  const prefix = currency === "USD" ? "US$" : currency === "CNY" ? "¥" : `${currency} `;
  return `From ${prefix}${new Intl.NumberFormat("en-US").format(value)} ${basis}`;
}

export default function JourneysPage() {
  const journeys = getAllJourneys();
  return <main>
    <SiteHeader />
    <header className="journeys-hero"><div className="narrow"><p>PRIVATE JOURNEYS THROUGH YUNNAN</p><h1>See less. Feel more.</h1><span>Thoughtful routes for travelers who want local context, an unhurried pace and support without the feeling of a conventional group tour.</span></div></header>
    <section className="journeys-list section"><div className="shell"><div className="section-heading"><h2>Start with a journey idea</h2><p>Every route can be adjusted around your dates, interests and preferred level of comfort.</p></div><div className="journeys-card-grid">{journeys.map((journey) => <JourneyCard key={journey.slug} priority={journey.frontmatter.featured} journey={{
      title: journey.frontmatter.shortTitle,
      subtitle: journey.frontmatter.excerpt,
      href: `/journeys/${journey.slug}`,
      image: journey.frontmatter.coverImage,
      imageAlt: journey.frontmatter.title,
      destination: journey.frontmatter.route,
      duration: journey.frontmatter.duration,
      fromPrice: priceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency, journey.frontmatter.priceBasis),
    }} />)}</div></div></section>
    <section className="journeys-philosophy section-sand"><div className="shell"><h2>Not a checklist. A journey shaped around you.</h2><div>{["Private travel with your own party", "Local drivers and guides where they matter", "No mandatory shopping stops", "A licensed local partner for contracting and delivery"].map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}</div></div></section>
    <ContentFooter />
  </main>;
}
