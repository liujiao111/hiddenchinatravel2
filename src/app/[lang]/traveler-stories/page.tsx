import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { localeUrl, localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { LocaleLink as Link } from "@/components/locale-link";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import { openingLine, getTravelerStoryPage, type TravelerStory } from "@/lib/traveler-stories";
import { getFeaturedJournals } from "@/lib/travel-journals";
import styles from "./stories.module.css";

const path = "/traveler-stories";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "stories" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return localizedStaticMetadata(lang, path, {
    title,
    description,
    openGraph: {
      title: `${title} | Hidden China Travel`,
      description,
      url: localeUrl(lang, path),
      type: "website",
      images: [{ url: "/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp", alt: t("heroAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hidden China Travel`,
      description,
      images: ["/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp"],
    },
  });
}

function StoryRoute({ story }: { story: TravelerStory }) {
  if (!story.journey) return null;
  return <Link className={styles.routeLink} href={story.journey.href}><span>{story.journey.title}</span> · {story.journey.duration}</Link>;
}

export default function TravelerStoriesPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("stories");
  const { stories, featured, detailed, metrics, permit, operatorName, operatorNameZh, registryHref, reasons, gallery } = getTravelerStoryPage(locale);
  const title = t("metaTitle");
  const description = t("metaDescription");
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage"))}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([{ name: t("home"), href: localeUrl(locale, "/") }, { name: t("current"), href: localeUrl(locale, path) }]),
      {
        "@type": "WebPage",
        name: title,
        inLanguage: locale === "zh" ? "zh-Hans" : "en",
        url: localeUrl(locale, path),
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
        <Image src="/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp" alt={t("heroAlt")} fill preload sizes="100vw" />
        <div className={styles.shade} />
        <div className={styles.heroCopy}>
          <nav className={styles.crumbs} aria-label="Breadcrumb"><Link href="/">{t("home")}</Link><span aria-hidden="true">/</span><span>{t("current")}</span></nav>
          <p className={styles.kicker}>{t("kicker")}</p>
          <h1>{t("heroTitle")}</h1>
          <p className={styles.heroLead}>{t("heroLead")}</p>
          <div className={styles.heroActions}>
            <Link href="#stories" className="button button-light">{t("readStories")}</Link>
            <EnquireLink data-cta-location="stories_hero" interest="Private Travel">{t("startPlanning")}</EnquireLink>
          </div>
        </div>
      </section>

      <p className={styles.privacyNote}>{t("privacy")}</p>

      <nav className={styles.subnav} aria-label="On this page">
        <Link href="#featured">{t("featuredNav")}</Link>
        <Link href="#notes">{t("notesNav")}</Link>
        <Link href="#why">{t("whyNav")}</Link>
        <Link href="#trust">{t("trustNav")}</Link>
      </nav>

      <section className={styles.metrics} aria-label="About these notes">
        <p className={styles.metric}><strong>{metrics.notes}</strong><span>{t("notesMetric")}</span></p>
        <p className={styles.metric}><strong>{metrics.countries}</strong><span>{t("countriesMetric")}</span></p>
        <p className={styles.metric}><strong>{locale === "zh" ? "私家团" : "Private"}</strong><span>{t("privateMetric")}</span></p>
        <p className={styles.metric}><strong>Joy</strong><span>{t("joyMetric")}</span></p>
      </section>

      <section className={`${styles.featured} ${styles.section}`} id="featured" aria-labelledby="featured-title">
        <div className="shell">
          <header className={styles.heading}>
            <h2 id="featured-title">{t("featuredTitle")}</h2>
            <p>{t("featuredIntro")}</p>
          </header>
        </div>
        {getFeaturedJournals(locale).map((journal) => (
          <Link className={styles.journalBand} href={`/traveler-stories/${journal.slug}`} key={journal.slug}>
            <figure>
              <Image src={journal.heroImage} alt={journal.heroAlt} fill sizes="(max-width: 800px) 100vw, 58vw" />
            </figure>
            <div>
              <p>{journal.category} · {journal.traveler}, {journal.country} · {journal.readingTime}</p>
              <h3>{journal.title}</h3>
              <span>{journal.subtitle}</span>
              <b>{t("readJournal")}</b>
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
            <h2 id="notes-title">{t("notesTitle")}</h2>
            <p>{t("notesIntro")}</p>
          </header>
          <div className={styles.noteGrid}>
            {stories.map((story) => {
              const full = story.role === "note";
              return <figure key={story.id}>
                <blockquote>“{full ? story.quote : openingLine(story.quote)}”</blockquote>
                <figcaption>
                  <b>{story.name}</b>
                  <span>{story.country} · {story.setting}</span>
                  {full ? null : <Link href={`#story-${story.id}`}>{t("readAccount")}</Link>}
                </figcaption>
              </figure>;
            })}
          </div>
          <p className={styles.colophon}>{t("colophon")}</p>
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
                  <div><dt>{t("whoTraveled")}</dt><dd>{story.party}</dd></div>
                  <div><dt>{t("whereNote")}</dt><dd>{story.setting}</dd></div>
                  <div><dt>{t("whatStayed")}</dt><dd>{story.noticed}</dd></div>
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
            <p className={styles.galleryIntro}>{t("galleryIntro")}</p>
            <div className={styles.gallery}>
              {gallery.map((frame) => (
                <figure className={`${styles.frame} ${frame.span === "tall" ? styles.frameTall : ""} ${frame.span === "wide" ? styles.frameWide : ""}`} key={frame.src}>
                  <Image className={styles.cover} src={frame.src} alt={frame.alt} fill sizes="(max-width: 700px) 100vw, 40vw" style={{ objectPosition: frame.position }} />
                  <figcaption><b>{frame.caption}</b><span>{frame.place}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className={styles.galleryNote}>{t("galleryNote")}</p>
          </div>
        </div>
      </section>

      <section className={`${styles.why} ${styles.section}`} id="why" aria-labelledby="why-title">
        <div className="shell">
          <header className={`${styles.heading} ${styles.center}`}>
            <h2 id="why-title">{t("whyTitle")}</h2>
            <p>{t("whyIntro")}</p>
          </header>
          <div className={styles.reasons}>
            {reasons.map((reason, index) => (
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
            <h2 id="trust-title">{t("trustTitle")}</h2>
            <p>{t("trustIntro")}</p>
          </header>
          <div className={styles.record}>
            <div>
              <p className={styles.permit}>{permit}</p>
              <h3>{locale === "zh" ? operatorNameZh : operatorName}</h3>
              <p>{locale === "zh" ? operatorName : operatorNameZh}.</p>
            </div>
            <div className={styles.recordLinks}>
              <Link href="/licensed-operator">{t("companyDocuments")}</Link>
              <a href={registryHref} target="_blank" rel="noopener noreferrer">{t("registry")}</a>
              <Link href="/booking">{t("bookingPayment")}</Link>
            </div>
          </div>
          <div className={styles.trustGrid}>
            <article>
              <h3>Tripadvisor</h3>
              <p>{t("tripadvisorText")}</p>
            </article>
            <article>
              <h3>Google reviews</h3>
              <p>{t("googleText")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="cta-title">
        <Image src="/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt={t("ctaAlt")} fill sizes="100vw" />
        <div className={styles.ctaShade} />
        <div className={styles.ctaCopy}>
          <h2 id="cta-title">{t("ctaTitle")}</h2>
          <p>{t("ctaText")}</p>
          <div className={styles.ctaActions}>
            <EnquireLink className="button button-light" data-cta-location="stories_close" interest="Private Travel">{t("startPlanning")}</EnquireLink>
            <a href={whatsapp}>{t("whatsapp")}</a>
          </div>
          <small>{siteConfig.replyTime}</small>
        </div>
      </section>
    </main>
    <ContentFooter />
    <JsonLd data={graph} />
  </>;
}
