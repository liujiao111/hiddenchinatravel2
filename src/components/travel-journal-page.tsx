import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JournalChrome } from "@/components/journal-chrome";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import type { TravelJournal } from "@/lib/travel-journals";
import { TravelerCaseStudy } from "@/components/traveler-case-study";
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
        description: journal.description,
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

      <article id="journal-article">
        <TravelerCaseStudy
          study={journal.caseStudy}
          narrative={journal.sections.map((section, index) => (
            <section className={`${styles.article} ${styles.section}`} id={section.id} aria-labelledby={`${section.id}-title`} key={section.id}>
              {index > 0 ? <hr className={styles.rule} /> : null}
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.image ? (
                <figure className={styles.figure}>
                  <Image src={section.image.src} alt={section.image.alt} fill sizes="(max-width: 800px) 100vw, 760px" style={{ objectPosition: section.image.position ?? "center 50%" }} />
                </figure>
              ) : null}
              {section.blocks.map((block) => {
                if (block.type === "paragraph") return <p key={block.text}>{block.text}</p>;
                if (block.type === "emphasis") return <p className={styles.emphasis} key={block.text}>{block.text}</p>;
                if (block.type === "list") {
                  return <ul key={block.items.join("|")}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
                }
                return (
                  <blockquote className={styles.pull} key={block.text}>
                    {block.text.split("\n").map((line) => <p key={line}>{line}</p>)}
                  </blockquote>
                );
              })}
            </section>
          ))}
        />
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
          <h2 id="journal-cta-title">Begin with how you like to travel.</h2>
          <p>Tell Joy the China you have already seen, and the pace you want. The route is designed from there.</p>
          <div className={styles.actions}>
            <EnquireLink className="button button-light" data-cta-location="journal_plan" interest="Private Travel">Start Planning My Journey</EnquireLink>
            <a className={styles.ghost} href={whatsapp}>WhatsApp Us</a>
          </div>
        </div>
      </section>
    </main>
    <ContentFooter />
    <JsonLd data={graph} />
  </>;
}
