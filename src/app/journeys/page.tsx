import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllJourneys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Private Yunnan Journeys",
  description: "Explore private, slower-paced journeys through Yunnan with trusted local drivers, guides and personal planning support from Joy Liu.",
  alternates: { canonical: "https://hiddenchinatravel.com/journeys" },
};

export default function JourneysPage() {
  const journeys = getAllJourneys();
  return <main>
    <SiteHeader />
    <header className="journeys-hero"><div className="narrow"><p>PRIVATE JOURNEYS THROUGH YUNNAN</p><h1>See less. Feel more.</h1><span>Thoughtful routes for travelers who want local context, an unhurried pace and support without the feeling of a conventional group tour.</span></div></header>
    <section className="journeys-list section"><div className="shell"><div className="section-heading"><h2>Start with a journey idea</h2><p>Every route can be adjusted around your dates, interests and preferred level of comfort.</p></div><div className="journeys-card-grid">{journeys.map((journey) => <Link href={`/journeys/${journey.slug}`} key={journey.slug}><div className="journeys-card-image"><Image src={journey.frontmatter.coverImage} alt={journey.frontmatter.title} fill priority={journey.frontmatter.featured} unoptimized sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="journeys-card-copy"><span>{journey.frontmatter.duration} · {journey.frontmatter.journeyType}</span><h2>{journey.frontmatter.shortTitle}</h2><p>{journey.frontmatter.excerpt}</p><div><b>From ¥{new Intl.NumberFormat("en-US").format(journey.frontmatter.fromPrice)} per person</b><strong>VIEW JOURNEY →</strong></div></div></Link>)}</div></div></section>
    <section className="journeys-philosophy section-sand"><div className="shell"><h2>Not a checklist. A journey shaped around you.</h2><div>{["Private travel with your own party", "Local drivers and guides where they matter", "No mandatory shopping stops", "A licensed local partner for contracting and delivery"].map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}</div></div></section>
    <ContentFooter />
  </main>;
}
