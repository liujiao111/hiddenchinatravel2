import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { ContactForm } from "@/components/contact-form";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { siteConfig } from "@/lib/site-config";
import { getSelectedTestimonials } from "@/lib/testimonials";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "contact" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return localizedStaticMetadata(lang, "/contact", {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: "/contact",
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

export default async function ContactPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "contact" });
  const tj = await getTranslations({ locale: lang, namespace: "journey" });
  const tq = await getTranslations({ locale: lang, namespace: "quickAsk" });
  const stories = getSelectedTestimonials();
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage"))}`;
  const steps = t.raw("steps") as [string, string, string][];
  const emphasis = t.raw("heroEmphasis") as string[];
  const founderParagraphs = t.raw("founderParagraphs") as string[];
  const planningPoints = t.raw("planningPoints") as string[];
  const questions = t.raw("questions") as string[];

  return (
    <main>
      <SiteHeader />

      <section className="contact-hero">
        <div className="shell contact-hero-copy">
          <p className="contact-kicker">{t("heroKicker")}</p>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroText")}</p>
          <div className="contact-hero-emphasis"><span>{emphasis[0]}</span><span>{emphasis[1]}</span><strong>{emphasis[2]}</strong></div>
          <Link className="button button-blue" href={whatsapp}>{tj("startPlanning")}</Link>
          <small>{tq("replyTime")}</small>
        </div>
      </section>

      <section className="contact-process section">
        <div className="shell">
          <header className="contact-section-heading">
            <p className="contact-kicker">{t("processKicker")}</p>
            <h2>{t("processHeading")}</h2>
          </header>
          <div className="contact-step-grid">
            {steps.map(([number, title, body]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                {body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-founder">
        <div className="contact-founder-image">
          <Image src="/brand/founder/portrait.webp" alt={t("founderAlt")} fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="contact-founder-copy">
          <p className="contact-kicker">{t("founderKicker")}</p>
          <h2>{t("founderTitle")}</h2>
          {founderParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <strong>{t("founderName")}</strong>
          <span>{t("founderRole")}</span>
        </div>
      </section>

      <Testimonials
        items={stories}
        eyebrow={tj("testimonialsEyebrow")}
        heading={tj("testimonialsHeading")}
        intro={tj("testimonialsIntroGeneric")}
        note={tj("testimonialsNote")}
      />

      <section className="contact-form-section section" id="enquire">
        <div className="shell contact-form-layout">
          <header>
            <p className="contact-kicker">{t("formKicker")}</p>
            <h2>{t("formHeading")}</h2>
            <p>{t("formText1")}</p>
            <p>{t("formText2a")}<br />{t("formText2b")}</p>
            <ul className="contact-planning-points">
              {planningPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </header>
          <ContactForm />
        </div>
      </section>

      <section className="contact-questions section">
        <div className="shell contact-questions-layout">
          <header>
            <p className="contact-kicker">{t("questionsKicker")}</p>
            <h2>{t("questionsHeading")}</h2>
          </header>
          <ul>{questions.map((question) => <li key={question}><span>✓</span>{question}</li>)}</ul>
        </div>
      </section>

      <section className="contact-alternatives section">
        <div className="shell">
          <header className="contact-section-heading">
            <p className="contact-kicker">{t("methodsKicker")}</p>
            <h2>{t("methodsHeading")}</h2>
          </header>
          <div className="contact-method-grid">
            <article><span>01</span><h3>WhatsApp</h3><p>{t("methodWhatsappText")}</p><Link href={whatsapp}>{t("methodWhatsappLink")}</Link></article>
            <article><span>02</span><h3>Email</h3><p>{t("methodEmailText")}</p><a href="mailto:joy.liu@hiddenchinatravel.com">joy.liu@hiddenchinatravel.com</a></article>
            <article><span>03</span><h3>{t("methodResponseTitle")}</h3><p>{tq("replyTime")}</p></article>
          </div>
        </div>
      </section>

      <section className="contact-final">
        <div className="narrow">
          <h2>{t("finalHeading")}</h2>
          <p>{t("finalP1")}</p>
          <p>{t("finalP2")}</p>
          <p>{t("finalP3a")}<br />{t("finalP3b")}</p>
          <Link className="button button-light" href={whatsapp}>{tj("startPlanning")}</Link>
        </div>
      </section>

      <ContentFooter />
    </main>
  );
}
