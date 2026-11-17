import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllTravelJournalStories } from "@/lib/travel-journal";
import "./travel-journal.css";
export const metadata: Metadata = { title: "Traveler Stories & Travel Journal", description: "Personal perspectives, unexpected discoveries and thoughtful journeys through China.", alternates: { canonical: "https://hiddenchinatravel.com/travel-journal" } };
export default function TravelJournalPage() {
 const stories=getAllTravelJournalStories();
 return <main className="journal-listing"><SiteHeader/><header className="journal-listing-intro"><p className="journal-eyebrow">THE HIDDEN CHINA JOURNAL</p><h1>Journeys that stay with you.</h1><p>Personal perspectives and thoughtful discoveries from travelers finding their own way through China.</p></header>
 <section className="journal-listing-feature" aria-label="Featured travel story">{stories.filter(s=>s.featured).map(story=><Link className="journal-feature-card" href={`/travel-journal/${story.slug}`} key={story.slug}><div className="journal-feature-image"><Image src={story.heroImage} alt={story.heroImageAlt} fill sizes="(max-width: 760px) 100vw, 58vw"/></div><div className="journal-feature-copy"><p className="journal-eyebrow">{story.category} · {story.theme}</p><h2>{story.title}</h2><p>{story.subtitle}</p><span className="journal-read-link">READ THE STORY ↗</span><small>{story.country} · {story.readingTime} read</small></div></Link>)}</section>
 <section className="journal-listing-note"><p>Every journey begins with a different question. These stories are about the moments, landscapes and unexpected turns that make a place feel personal.</p></section><ContentFooter/></main>;
}