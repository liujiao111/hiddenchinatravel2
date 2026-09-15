import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { ContentCta, ContentFooter } from "@/components/content-footer";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { TopicNavigation } from "@/components/topic-navigation";

export function HubPage({ item }: { item: ContentItem }) {
  const { frontmatter } = item;
  return <main>
    <SiteHeader />
    <TopicNavigation active={frontmatter.title} />
    <header className="hub-hero"><div className="narrow"><p>{frontmatter.eyebrow || "PRACTICAL CHINA TRAVEL GUIDES"}</p><h1>{frontmatter.title}</h1><span>{frontmatter.description || frontmatter.metaDescription}</span></div></header>
    {frontmatter.heroAnswer && <section className="hub-answer"><div className="narrow"><p>THE SHORT ANSWER</p><h2>{frontmatter.heroAnswer}</h2></div></section>}
    <div className="hub-sections shell">
      {frontmatter.subtopics?.map((subtopic, index) => <section key={subtopic.id} id={subtopic.id} className="hub-topic"><header><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{subtopic.name}</h2>{subtopic.description && <p>{subtopic.description}</p>}</div></header><div className="hub-card-grid">{subtopic.articles?.filter((article) => article.status !== "planned").map((article) => <Link href={article.href} key={article.href}><span>{article.badge || "Guide"}</span><h3>{article.title}</h3><p>{article.excerpt}</p><b>READ GUIDE →</b></Link>)}</div></section>)}
    </div>
    {frontmatter.beforeYouArrive && <section className="hub-editorial"><div className="narrow"><p className="article-section">BEFORE YOU ARRIVE</p><h2>{frontmatter.beforeYouArriveHeading}</h2><MarkdownContent>{frontmatter.beforeYouArrive}</MarkdownContent></div></section>}
    {frontmatter.decisionGuide && <section className="hub-decision"><div className="shell"><div><p className="article-section">MAKE THE RIGHT CHOICE</p><h2>{frontmatter.decisionGuide.title}</h2><p>{frontmatter.decisionGuide.intro}</p></div><div><ul>{frontmatter.decisionGuide.points?.map((point) => <li key={point}>{point}</li>)}</ul>{frontmatter.decisionGuide.recommendation && <strong>{frontmatter.decisionGuide.recommendation}</strong>}</div></div></section>}
    {frontmatter.faqs?.length ? <section className="article-faq"><div className="narrow"><p className="article-section">COMMON QUESTIONS</p><h2>{frontmatter.faqHeading || "Frequently asked questions"}</h2>{frontmatter.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><MarkdownContent compact>{faq.answer}</MarkdownContent></details>)}</div></section> : null}
    {frontmatter.relatedHubs?.length ? <section className="related-guides shell"><div className="section-heading"><h2>Explore related topics</h2></div><div className="related-grid">{frontmatter.relatedHubs.map((hub) => <Link key={hub.href} href={hub.href}><span>TRAVEL ESSENTIAL</span><h3>{hub.title}</h3><p>{hub.excerpt}</p><b>EXPLORE →</b></Link>)}</div></section> : null}
    <ContentCta />
    <ContentFooter />
  </main>;
}
