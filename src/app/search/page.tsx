import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteSearch } from "@/components/site-search";
import { getSearchIndex } from "@/lib/search-index";
import { matchSearchItems } from "@/lib/search-types";

export const metadata: Metadata = {
  title: "Search China Travel Guides | Hidden China Travel",
  description: "Search Hidden China Travel destination advice, planning essentials and practical guides.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim() || "";
  const items = getSearchIndex();
  const results = matchSearchItems(items, query);

  return <main>
    <SiteHeader />
    <section className="search-hero"><div className="narrow"><p className="kicker">TRAVEL GUIDES & JOURNEYS</p><h1>What can we help you find?</h1><SiteSearch variant="page" initialQuery={query} items={items} /></div></section>
    <section className="search-results shell">
      <header><h2>{query ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”` : "Search our China travel advice"}</h2><p>{query ? "Practical guidance and journey ideas from Hidden China Travel." : "Try payments, Yunnan, trains, internet or Dali."}</p></header>
      {results.length ? <div className="search-result-grid">{results.map((item) => <Link href={item.href} key={item.id} className="search-result-card">
        <div className="search-result-image">{item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /> : <span>H</span>}</div>
        <div><span>{item.type === "article" ? "Travel guide" : item.type}</span><h3>{item.title}</h3><p>{item.description}</p><b>VIEW {item.type === "article" ? "GUIDE" : "PAGE"} →</b></div>
      </Link>)}</div> : query ? <div className="search-empty"><h3>No exact matches yet.</h3><p>Try a shorter phrase, or browse all practical travel guides.</p><Link href="/#guides" className="button button-green">BROWSE TRAVEL GUIDES</Link></div> : null}
    </section>
    <ContentFooter />
  </main>;
}
