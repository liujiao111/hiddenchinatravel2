import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ContentItem } from "@/lib/content";
import type { LocaleAlternate, AppLocale } from "@/lib/i18n-seo";
import { ContentCta, ContentFooter } from "@/components/content-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { QuickAsk } from "@/components/quick-ask";
import { isTripPlanningSection } from "@/lib/enquiry";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function HubPage({ item, alternate, lang }: { item: ContentItem; alternate?: LocaleAlternate; lang: AppLocale }) {
  const { frontmatter } = item;
  const t = await getTranslations({ locale: lang, namespace: "hub" });
  const tMobile = await getTranslations({ locale: lang, namespace: "mobileCta" });
  const whatsapp = buildWhatsAppUrl(undefined, lang === "zh" ? "zh" : "en");
  return <main>
    <SiteHeader alternate={alternate} />
    <TopicNavigation active={frontmatter.title} lang={lang} />
    <header className="hub-hero"><div className="narrow"><p>{frontmatter.eyebrow || t("eyebrowDefault")}</p><h1>{frontmatter.title}</h1><span>{frontmatter.description || frontmatter.metaDescription}</span></div></header>
    {frontmatter.heroAnswer && <section className="hub-answer"><div className="narrow"><p>{t("shortAnswer")}</p><h2>{frontmatter.heroAnswer}</h2></div></section>}
    <div className="hub-sections shell">
      {frontmatter.subtopics?.map((subtopic, index) => <section key={subtopic.id} id={subtopic.id} className="hub-topic"><header><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{subtopic.name}</h2>{subtopic.description && <p>{subtopic.description}</p>}</div></header><div className="hub-card-grid">{subtopic.articles?.filter((article) => article.status !== "planned").map((article) => <Link href={article.href} key={article.href}><span>{article.badge || t("badgeDefault")}</span><h3>{article.title}</h3><p>{article.excerpt}</p><b>{t("readGuide")}</b></Link>)}</div></section>)}
    </div>
    {frontmatter.beforeYouArrive && <section className="hub-editorial"><div className="narrow"><p className="article-section">{t("beforeYouArrive")}</p><h2>{frontmatter.beforeYouArriveHeading}</h2><MarkdownContent>{frontmatter.beforeYouArrive}</MarkdownContent></div></section>}
    {frontmatter.decisionGuide && <section className="hub-decision"><div className="shell"><div><p className="article-section">{t("decisionKicker")}</p><h2>{frontmatter.decisionGuide.title}</h2><p>{frontmatter.decisionGuide.intro}</p></div><div><ul>{frontmatter.decisionGuide.points?.map((point) => <li key={point}>{point}</li>)}</ul>{frontmatter.decisionGuide.recommendation && <strong>{frontmatter.decisionGuide.recommendation}</strong>}</div></div></section>}
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">{t("faqKicker")}</p><h2>{frontmatter.faqHeading || t("faqHeading")}</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    {frontmatter.relatedHubs?.length ? <section className="related-guides shell"><div className="section-heading"><h2>{t("relatedHeading")}</h2></div><div className="related-grid">{frontmatter.relatedHubs.map((hub) => <Link key={hub.href} href={hub.href}><span>{t("relatedBadge")}</span><h3>{hub.title}</h3><p>{hub.excerpt}</p><b>{t("explore")}</b></Link>)}</div></section> : null}
    <QuickAsk source={`/${item.slug}`} sourceTitle={frontmatter.title} intent={isTripPlanningSection(frontmatter.title) ? "trip" : "advice"} />
    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
    />
    <ContentCta />
    <ContentFooter />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "CollectionPage", name: frontmatter.title, description: frontmatter.metaDescription || frontmatter.description, url: `https://hiddenchinatravel.com/${item.slug}` },
        breadcrumbList([{ name: t("breadcrumbHome"), href: "/" }, { name: frontmatter.title, href: `/${item.slug}` }]),
      ],
    }} />
  </main>;
}
