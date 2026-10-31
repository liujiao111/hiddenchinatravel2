import type { Metadata } from "next";
import Image from "next/image";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { Link } from "@/i18n/navigation";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import { openingLine, routeGallery, travelerStoryReasons, getTravelerStoryPage, type TravelerStory } from "@/lib/traveler-stories";
import { getFeaturedJournals } from "@/lib/travel-journals";
import styles from "./stories.module.css";

const path = "/traveler-stories";
const title = "Traveler Stories";
const description = "Personal accounts from families, couples and first-time visitors on private Yunnan journeys planned with Joy Liu."

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  return localizedStaticMetadata(lang, path, {
    title,
    description,
    openGraph: {
      title: `${title} | Hidden China Travel`,
      description,
      url: path,
      type: "website",
      images: [{ url: "/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp", alt: "Dali Ancient Town at dusk, with tiled roofs and lantern-lit streets" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hidden China Travel`,
      description,
      images: ["/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp"],
    },
  });
}

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi Joy, I read the traveler stories and would like to talk about a private Yunnan journey.")}`;

function StoryRoute({ story }: { story: TravelerStory }) {
  if (!story.journey) return null;
  return <Link className={styles.routeLink} href={story.journey.href}><span>{story.journey.title}</span> · {story.journey.duration}</Link>;
}

export default function TravelerStoriesPage() {
  const { stories, featured, detailed, metrics, permit, operatorName, operatorNameZh, registryHref } = getTravelerStoryPage();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([{ name: "Home", href: "/" }, { name: "Traveler stories", href: path }]),
      {
        "@type": "WebPage",
        name: title,
        url: `https://hiddenchinatravel.com${path}`,
        description,
      },
      ...stories.map((story) => ({
        "@type": "Review",
        author: { "@type": "Person", name: story.name },
        reviewBody: story.quote,
        name: story.title,
        itemReviewed: {
          "@type": "TravelAgency",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      })),
    ],
  };

  return <>
    <SiteHeader />
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src="/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp" alt="Dali Ancient Town at dusk, with tiled roofs and lantern-lit streets" fill preload sizes="100vw" />
        <div className={styles.shade} />
        <div className={styles.heroCopy}>
          <nav className={styles.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Traveler stories</span></nav>
          <p className={styles.kicker}>PRIVATE YUNNAN JOURNEYS</p>
          <h1>How Yunnan felt, in their words.</h1>
          <p className={styles.heroLead}>Notes from private parties who traveled with Joy Liu. Families returning, a honeymoon, a first trip with a child. The planning is personal.</p>
          <div className={styles.heroActions}>
            <Link href="#stories" className="button button-light">READ THE STORIES</Link>
            <EnquireLink data-cta-location="stories_hero" interest="Private Travel">Start Planning My Journey</EnquireLink>
          </div>
        </div>
      </section>

      <p className={styles.privacyNote}>For privacy, we use photographs of the places rather than the travelers themselves.</p>

      <nav className={styles.subnav} aria-label="On this page">
        <Link href="#featured">Featured Stories</Link>
        <Link href="#notes">Traveler Notes</Link>
        <Link href="#why">Why Travelers Choose This Way</Link>
        <Link href="#trust">Trust &amp; Credentials</Link>
      </nav>

      <section className={styles.metrics} aria-label="About these notes">
        <p className={styles.metric}><strong>{metrics.notes}</strong><span>Traveler notes published on this page</span></p>
        <p className={styles.metric}><strong>{metrics.countries}</strong><span>Countries they wrote from</span></p>
        <p className={styles.metric}><strong>Private</strong><span>Your own party, vehicle and pace</span></p>
        <p className={styles.metric}><strong>Joy</strong><span>One consultant, from the first note to the road</span></p>
      </section>

      <section className={`${styles.featured} ${styles.section}`} id="featured" aria-labelledby="featured-title">
        <div className="shell">
          <header className={styles.heading}>
            <h2 id="featured-title">Featured Stories</h2>
            <p>Personal accounts of the people, planning and moments that shaped each journey.</p>
          </header>
        </div>
        {getFeaturedJournals().map((journal) => (
          <Link className={styles.journalBand} href={`/traveler-stories/${journal.slug}`} key={journal.slug}>
            <figure>
              <Image src={journal.heroImage} alt={journal.heroAlt} fill sizes="(max-width: 800px) 100vw, 58vw" />
            </figure>
            <div>
              <p>{journal.category} · {journal.traveler}, {journal.country} · {journal.readingTime}</p>
              <h3>{journal.title}</h3>
              <span>{journal.subtitle}</span>
              <b>READ THE JOURNAL</b>
            </div>
          </Link>
        ))}
        {featured.map((story, index) => (
          <article className={index % 2 === 1 ? `${styles.feature} ${styles.featureReverse}` : styles.feature} id={`story-${story.id}`} key={story.id}>
            <figure className={styles.featureMedia}>
              <Image className={styles.cover} src={story.image} alt={story.imageAlt} fill sizes="(max-width: 980px) 100vw, 58vw" style={{ objectPosition: story.objectPosition }} />

            </figure>
            <div className={styles.featureCopy}>
              <p className={styles.meta}>{story.country} · {story.party}</p>
              <h2>{story.title}</h2>
              <blockquote>“{story.quote}”</blockquote>
              <footer className={styles.byline}>
                <b>{story.name}</b>
                <span>{story.setting}</span>
                <StoryRoute story={story} />
              </footer>
            </div>
          </article>
        ))}
      </section>

      <section className={`${styles.notes} ${styles.section}`} id="notes" aria-labelledby="notes-title">
        <div className="shell">
          <header className={`${styles.heading} ${styles.center}`}>
            <h2 id="notes-title">Traveler Notes</h2>
            <p>A first line from each traveler. Where a longer account appears on this page, you can continue into it. The others are printed here in full.</p>
          </header>
          <div className={styles.noteGrid}>
            {stories.map((story) => {
              const full = story.role === "note";
              return <figure key={story.id}>
                <blockquote>“{full ? story.quote : openingLine(story.quote)}”</blockquote>
                <figcaption>
                  <b>{story.name}</b>
                  <span>{story.country} · {story.setting}</span>
                  {full ? null : <Link href={`#story-${story.id}`}>Read the account</Link>}
                </figcaption>
              </figure>;
            })}
          </div>
          <p className={styles.colophon}>Names may be shortened. Some notes were translated and edited for clarity.</p>
        </div>

        <div className={`${styles.details} ${styles.detailGroup}`} id="journeys">
          <div className="shell">
          {detailed.map((story) => (
            <article className={styles.detail} id={`story-${story.id}`} key={story.id}>
              <figure className={styles.detailMedia}>
                <Image className={styles.cover} src={story.image} alt={story.imageAlt} fill sizes="(max-width: 980px) 100vw, 40vw" style={{ objectPosition: story.objectPosition }} />

              </figure>
              <div>
                <p className={styles.meta}>{story.country}</p>
                <h3>{story.title}</h3>
                <dl className={styles.facts}>
                  <div><dt>Who traveled</dt><dd>{story.party}</dd></div>
                  <div><dt>Where the note sits</dt><dd>{story.setting}</dd></div>
                  <div><dt>What stayed with them</dt><dd>{story.noticed}</dd></div>
                </dl>
                <blockquote>“{story.quote}”</blockquote>
                <footer className={styles.byline}>
                  <b>{story.name}</b>
                  <span>{story.country}</span>
                  <StoryRoute story={story} />
                </footer>
              </div>
            </article>
          ))}
          </div>
        </div>

        <div className={`${styles.places} ${styles.routeGallerySection}`} id="places">
          <div className="shell">
            <p className={styles.galleryIntro}>Dali, Shaxi, the gorge, Lijiang and Shangri-La — the places that appear in these journeys.</p>
            <div className={styles.gallery}>
              {routeGallery.map((frame) => (
                <figure className={`${styles.frame} ${frame.span === "tall" ? styles.frameTall : ""} ${frame.span === "wide" ? styles.frameWide : ""}`} key={frame.src}>
                  <Image className={styles.cover} src={frame.src} alt={frame.alt} fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectPosition: frame.position }} />
                  <figcaption><b>{frame.caption}</b><span>{frame.place}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className={styles.galleryNote}>These photographs were made on the route. They were not supplied by the travelers, and a journey does not promise every frame.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.why} ${styles.section}`} id="why" aria-labelledby="why-title">
        <div className="shell">
          <header className={`${styles.heading} ${styles.center}`}>
            <h2 id="why-title">Why Travelers Choose This Way</h2>
            <p>The same practical things recur across the notes. They are also how a private Yunnan journey is arranged.</p>
          </header>
          <div className={styles.reasons}>
            {travelerStoryReasons.map((reason, index) => (
              <article key={reason.title}>
                <span>0{index + 1}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.trust} ${styles.section}`} id="trust" aria-labelledby="trust-title">
        <div className="shell">
          <header className={styles.heading}>
            <h2 id="trust-title">Trust &amp; Credentials</h2>
            <p>Joy Liu plans each journey. The licensed Kunming agency named below handles the travel contract and receives payment.</p>
          </header>
          <div className={styles.record}>
            <div>
              <p className={styles.permit}>{permit}</p>
              <h3>{operatorName}</h3>
              <p>{operatorNameZh}.</p>
            </div>
            <div className={styles.recordLinks}>
              <Link href="/licensed-operator">Read the company documents</Link>
              <a href={registryHref} target="_blank" rel="noopener noreferrer">Look up the company on gsxt.gov.cn</a>
              <Link href="/booking">How booking and payment work</Link>
            </div>
          </div>
          <div className={styles.trustGrid}>
            <article>
              <h3>Tripadvisor</h3>
              <p>Read the notes on this page: named parties, named places, shared with permission. Names may be shortened, and some lines were translated for clarity. There is no Tripadvisor average beside them.</p>
            </article>
            <article>
              <h3>Google reviews</h3>
              <p>There is no Google rating on this page. When a profile can be read in full, its link will sit here, next to the permit and the company documents.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="cta-title">
        <Image src="/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="A musician playing guitar from a moored boat on the shore of Erhai Lake" fill sizes="100vw" />
        <div className={styles.ctaShade} />
        <div className={styles.ctaCopy}>
          <h2 id="cta-title">Tell Joy who is traveling.</h2>
          <p>A month, who is coming, and how you want the days to feel. You will see a written route before any payment. Nothing is confirmed until you have read it.</p>
          <div className={styles.ctaActions}>
            <EnquireLink className="button button-light" data-cta-location="stories_close" interest="Private Travel">Start Planning My Journey</EnquireLink>
            <a href={whatsapp}>Or write to Joy on WhatsApp</a>
          </div>
          <small>{siteConfig.replyTime}</small>
        </div>
      </section>
    </main>
    <ContentFooter />
    <JsonLd data={graph} />
  </>;
}
