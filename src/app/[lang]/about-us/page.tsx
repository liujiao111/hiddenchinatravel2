import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { OperatorCredentials } from "@/components/operator-credentials";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { getOperatorPaymentCopy } from "@/lib/booking-terms-i18n";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";
import { getSelectedTestimonials } from "@/lib/testimonials";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import styles from "./about.module.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return localizedStaticMetadata(lang, "/about-us", {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: "/about-us",
      type: "website",
      images: [{ url: "/brand/founder/portrait.webp", alt: t("ogImageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/founder/portrait.webp"],
    },
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "about" });
  const tj = await getTranslations({ locale: lang, namespace: "journey" });
  const stories = getSelectedTestimonials(lang);
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage"))}`;
  const subnav = t.raw("subnav") as string[];
  const subnavHrefs = ["#joy", "#philosophy", "#why-us", "#booking", "#local-partners", "#stories"];
  const founderParagraphs = t.raw("founderParagraphs") as string[];
  const originParagraphs = t.raw("originParagraphs") as string[];
  const philosophyParagraphs = t.raw("philosophyParagraphs") as string[];
  const reasons = t.raw("reasons") as [string, string][];
  const checklist = t.raw("checklist") as string[];
  const questions: [string, string][] = [
    [t("faqDirectQ"), t("faqDirectA")],
    [t("faqOperatorQ"), getOperatorPaymentCopy(lang)],
    [t("faqItineraryQ"), t("faqItineraryA")],
    [t("faqWeatherQ"), t("faqWeatherA")],
  ];

  return <><SiteHeader /><main className={styles.page}>
    <section className={styles.hero}>
      <Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp" alt={t("heroImageAlt")} fill preload sizes="100vw" />
      <div className={styles.shade} />
      <div className={styles.heroCopy}>
        <nav aria-label={tj("breadcrumbAria")}><Link href="/">{tj("breadcrumbHome")}</Link><span>/</span><span>{t("breadcrumbAbout")}</span></nav>
        <h1>{t("heroTitleA")}<br />{t("heroTitleB")}</h1>
        <p>{t("heroText")}</p>
        <Link href="#joy" className="button button-light">{t("heroCta")}</Link>
      </div>
    </section>
    <nav className={styles.subnav} aria-label={t("subnavAria")}>{subnav.map((label, index) => <Link key={subnavHrefs[index]} href={subnavHrefs[index]}>{label}</Link>)}</nav>

    <section className={`shell ${styles.founder}`} id="joy">
      <figure className={styles.portrait}><Image src="/brand/founder/portrait.webp" alt={t("founderAlt")} fill sizes="(max-width: 800px) 100vw, 42vw" /><figcaption><strong>Joy Liu</strong><span>{t("founderRole")}</span><span>{t("founderBased")}</span></figcaption></figure>
      <div className={styles.copy}><h2>{t("founderHeadingA")}<br />{t("founderHeadingB")}</h2>
        {founderParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.signature}>{t("founderSignature")}</p>
      </div>
    </section>

    <section className={styles.origin}><div className={`shell ${styles.split}`}><h2>{t("originHeading")}</h2><div className={styles.copy}>
      {originParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link className={styles.textLink} href="/survival-kit">{t("originLink")}</Link>
    </div></div></section>

    <section className={styles.philosophy} id="philosophy"><div className={styles.landscape}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt={t("philosophyImageAlt")} fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className={styles.philosophyCopy}>
      <h2>{t("philosophyHeadingA")}<br />{t("philosophyHeadingB")}</h2>
      {philosophyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link className={styles.textLink} href="/journeys">{t("philosophyLink1")}</Link><p><Link className={styles.textLink} href="/custom-china-tour" data-cta-location="about_custom">{t("philosophyLink2")}</Link></p>
    </div></section>
    <section className={styles.quote}><blockquote>“{t("quoteA")}<br />{t("quoteB")}”</blockquote><p>{t("quoteBy")}</p></section>

    <section className={`shell ${styles.section}`} id="why-us"><div className={styles.heading}><h2>{t("whyHeading")}</h2><p>{t("whySub")}</p></div><div className={styles.reasons}>{reasons.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={styles.booking} id="booking"><div className="shell"><div className={styles.heading}><h2>{t("bookingHeadingA")}<br />{t("bookingHeadingB")}</h2><p>{t("bookingSub")}</p></div><div className={styles.roles}>
      <article><h3>{t("bookingRoleJoyTitle")}</h3><p>{t("bookingRoleJoyText")}</p></article>
      <article><h3>{t("bookingAgencyTitle", { agency: lang === "zh" ? licensedOperator.nameZh : licensedOperator.nameEn })}</h3><p>{t("bookingAgencyText", { agencyEn: licensedOperator.nameEn, agencyZh: licensedOperator.nameZh, address: lang === "zh" ? licensedOperator.addressZh : licensedOperator.addressEn, permit: licensedOperator.permitNumber })}</p><p><Link href="/licensed-operator">{t("bookingAgencyLink")}</Link></p></article>
    </div><div className={styles.checklist}><h3>{t("checklistHeading")}</h3><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul><p>{t("checklistNote")}</p></div>
    <div id="local-partners"><OperatorCredentials /></div></div></section>

    <Testimonials
      items={stories}
      eyebrow={tj("testimonialsEyebrow")}
      heading={tj("testimonialsHeading")}
      intro={tj("testimonialsIntroGeneric")}
      note={tj("testimonialsNote")}
      archiveHref="/traveler-stories"
      archiveLabel={t("archiveLabel")}
    />

    <section className={styles.faq}><div className={`shell ${styles.faqGrid}`}><div><h2>{t("faqHeading")}</h2><p>{t("faqSub")}</p></div><div>{questions.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    <section className={styles.cta}><div className="shell"><h2>{t("ctaHeading")}</h2><p>{t("ctaText")}</p><Link href={whatsapp} className="button button-light">{tj("startPlanning")}</Link><Link href="/contact">{t("ctaEmail")}</Link><span>{t("ctaNote")}</span></div></section>
  </main><ContentFooter />
  <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbList([{ name: tj("breadcrumbHome"), href: "/" }, { name: t("breadcrumbAbout"), href: "/about-us" }])] }} />
  </>;
}
