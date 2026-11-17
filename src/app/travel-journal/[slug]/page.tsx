import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentFooter } from "@/components/content-footer";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { getAllTravelJournalStories, getTravelJournalStoryBySlug } from "@/lib/travel-journal";
import { StoryReadingProgress, StoryShareButton } from "@/components/travel-journal-interactions";
import "./travel-journal.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getAllTravelJournalStories().map((story) => ({ slug: story.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = getTravelJournalStoryBySlug((await params).slug);
  if (!story) return {};
  const url = `https://hiddenchinatravel.com/travel-journal/${story.slug}`;
  return { title: story.title, description: story.subtitle, alternates: { canonical: url }, openGraph: { title: story.title, description: story.subtitle, url, type: "article", images: [{ url: story.heroImage, alt: story.heroImageAlt }] }, twitter: { card: "summary_large_image", title: story.title, description: story.subtitle, images: [story.heroImage] } };
}
export default async function TravelJournalStoryPage({ params }: Props) {
  const story = getTravelJournalStoryBySlug((await params).slug);
  if (!story) notFound();
  const canonical = `https://hiddenchinatravel.com/travel-journal/${story.slug}`;
  return <main className="journal-page">
    <StoryReadingProgress /><SiteHeader />
    <header className="journal-hero">
      <Image src={story.heroImage} alt={story.heroImageAlt} fill priority sizes="100vw" className="journal-hero-image" />
      <div className="journal-hero-shade" />
      <div className="journal-hero-copy">
        <Link href="/travel-journal" className="journal-back">TRAVEL JOURNAL</Link>
        <p className="journal-eyebrow">{story.theme}</p><h1>{story.title}</h1>
        <p className="journal-subtitle">{story.subtitle}</p>
      </div>
      <span className="journal-image-caption">The Stone Forest, near Kunming · Yunnan, China</span>
    </header>
    <div className="journal-meta"><span>{story.traveler} · {story.country}</span><i /><span>{story.travelStyle}</span><i /><span>{story.firstVisit}</span><i /><span>{story.readingTime} read</span></div>
    <section className="journal-profile" aria-label="Traveler profile">
      <div><span>TRAVELER</span><strong>{story.traveler}, Canada</strong></div>
      <div><span>TRAVEL STYLE</span><strong>{story.travelStyle}</strong></div>
      <div><span>JOURNEY</span><strong>{story.firstVisit} · Designed by Hidden China</strong></div>
      <div className="journal-profile-route"><span>THE ROUTE</span><strong>{story.route.join(" → ")}</strong></div>
    </section>
    <article className="journal-article">
      <p className="journal-standfirst">A journey across China's cities led Matthew to a different question: what else was waiting beyond the places he already knew?</p>
      {story.sections.map((section, index) => <section className="journal-section" key={section.heading}>
        {index === 4 && <blockquote className="journal-pullquote"><span aria-hidden="true">“</span><p>{story.quote}</p><div className="journal-quote-rule" /></blockquote>}
        <p className="journal-section-number">{String(index + 1).padStart(2, "0")}</p><h2>{section.heading}</h2>
        {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </section>)}
      <div className="journal-endmark" aria-hidden="true"><span /><span /><span /></div>
    </article>
    <section className="journal-related"><div className="journal-related-inner"><p className="journal-eyebrow">FOLLOW THE THREAD</p><h2>Places to take the story further</h2><p className="journal-related-intro">The first visit is often just an introduction. These places offer more reasons to return.</p>
      <div className="journal-place-links">{story.relatedPlaces.map((place, i) => <Link href={place.href} key={place.title}><span>0{i+1}</span>{place.title}<b aria-hidden="true">↗</b></Link>)}</div>
    </div></section>
    <section className="journal-cta"><div className="journal-cta-inner"><p className="journal-eyebrow">YOUR JOURNEY, YOUR PACE</p><h2>Ready to Discover Your Own Side of Yunnan?</h2><p>Tell us your travel dates and interests. We'll create a journey designed around how you like to travel.</p>
      <div className="journal-cta-actions"><Link className="journal-button journal-button-dark" href="/custom-china-tour" data-cta-location="travel_journal_story">Start Planning</Link><a className="journal-button journal-button-outline" href="https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20to%20plan%20a%20Yunnan%20journey." target="_blank" rel="noreferrer" data-cta-location="travel_journal_story_whatsapp">WhatsApp Us</a></div>
    </div></section>
    <ContentFooter />
    <StoryShareButton title={story.title} />
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [
      { "@type": "Article", headline: story.title, description: story.subtitle, image: `https://hiddenchinatravel.com${story.heroImage}`, mainEntityOfPage: canonical, articleSection: story.category, timeRequired: "PT5M", inLanguage: "en", publisher: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" } },
      breadcrumbList([{ name: "Home", href: "/" }, { name: "Travel Journal", href: "/travel-journal" }, { name: story.title, href: `/travel-journal/${story.slug}` }])
    ] }} />
  </main>;
}
