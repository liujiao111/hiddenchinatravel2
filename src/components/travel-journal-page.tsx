import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JournalChrome } from "@/components/journal-chrome";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import type { TravelJournal } from "@/lib/travel-journals";
import styles from "@/app/traveler-stories/journal.module.css";

export function TravelJournalPage({ journal }: { journal: TravelJournal }) {
  const path = `/traveler-stories/${journal.slug}`;
  const url = `${siteConfig.url}${path}`;
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hi Joy, I read “${journal.title}” and would like to plan a Yunnan journey.`)}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([
        { name: "Home", href: "/" },
        { name: "Traveler stories", href: "/traveler-stories" },
        { name: journal.title, href: path },
      ]),
      {
        "@type": "Article",
        headline: journal.title,
        description: journal.subtitle,
        image: `${siteConfig.url}${journal.heroImage}`,
        articleSection: journal.category,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        mainEntityOfPage: url,
        about: journal.theme,
      },
    ],
  };

  return <>
    <SiteHeader />
    <JournalChrome title={journal.title} url={url} />
    <main className={`${styles.page} journal-page`}>
      <header className={styles.hero}>
        <Image src={journal.heroImage} alt={journal.heroAlt} fill preload sizes="100vw" />
        <div className={styles.shade} />
        <div className={styles.heroCopy}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/traveler-stories">Traveler stories</Link>
            <span aria-hidden="true">/</span>
            <span>{journal.category}</span>
          </nav>
          <p className={styles.kicker}>{journal.category}</p>
          <h1>{journal.title}</h1>
          <p className={styles.dek}>{journal.subtitle}</p>
        </div>
      </header>

      <p className={styles.meta}>
        <span>{journal.country}</span>
        <span>{journal.travelStyle}</span>
        <span>{journal.theme}</span>
        <span>{journal.readingTime} read</span>
      </p>

      <article id="journal-article">
        {journal.sections.map((section, index) => (
          <div key={section.id}>
            <section className={`${styles.article} ${styles.section}`} id={section.id} aria-labelledby={`${section.id}-title`}>
              {index > 0 ? <hr className={styles.rule} /> : null}
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
            {journal.pullQuoteAfter === section.id ? <blockquote className={styles.pull}><p>{journal.pullQuote}</p></blockquote> : null}
          </div>
        ))}
      </article>

      <section className={styles.related} aria-labelledby="related-title">
        <h2 id="related-title">Related journeys</h2>
        <div className={styles.places}>
          {journal.related.map((place) => (
            <Link className={styles.place} href={place.href} key={place.title}>
              <figure className={styles.placeFigure}>
                <Image src={place.image} alt={place.alt} fill sizes="(max-width: 700px) 100vw, 25vw" style={{ objectPosition: place.position ?? "center 55%" }} />
              </figure>
              <b>{place.title}</b>
              <small>{place.note}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="journal-cta-title">
        <Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="A herder and goats on the river path in Shaxi, Yunnan" fill sizes="100vw" />
        <div className={styles.ctaShade} />
        <div className={styles.ctaCopy}>
          <h2 id="journal-cta-title">Ready to Discover Your Own Side of Yunnan?</h2>
          <p>Tell us your travel dates and interests. We’ll create a journey designed around how you like to travel.</p>
          <div className={styles.actions}>
            <EnquireLink className="button button-light" data-cta-location="journal_plan" interest="Private Travel">Start Planning</EnquireLink>
            <a className={styles.ghost} href={whatsapp}>WhatsApp Us</a>
          </div>
        </div>
      </section>
    </main>
    <ContentFooter />
    <JsonLd data={graph} />
  </>;
}
