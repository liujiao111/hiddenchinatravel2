import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteSearch } from "@/components/site-search";
import type { AppLocale } from "@/lib/i18n-seo";
import { getSearchIndex } from "@/lib/search-index";
import { matchSearchItems } from "@/lib/search-types";

type Props = {
  params: Promise<{ lang: AppLocale }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "search" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ lang }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "search" });
  const query = resolvedSearchParams.q?.trim() || "";
  const items = getSearchIndex(lang);
  const results = matchSearchItems(items, query);

  return <main>
    <SiteHeader />
    <section className="search-hero"><div className="narrow"><p className="kicker">{t("kicker")}</p><h1>{t("heading")}</h1><SiteSearch variant="page" initialQuery={query} items={items} /></div></section>
    <section className="search-results shell">
      <header><h2>{query ? t("resultsCount", { count: results.length, query }) : t("defaultHeading")}</h2><p>{query ? t("querySubtitle") : t("defaultSubtitle")}</p></header>
      {results.length ? <div className="search-result-grid">{results.map((item) => <Link href={item.href} key={item.id} className="search-result-card">
        <div className="search-result-image">{item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /> : <span>H</span>}</div>
        <div><span>{t(`types.${item.type}`)}</span><h3>{item.title}</h3><p>{item.description}</p><b>{t(`view.${item.type}`)} →</b></div>
      </Link>)}</div> : query ? <div className="search-empty"><h3>{t("emptyTitle")}</h3><p>{t("emptyText")}</p><Link href="/#guides" className="button button-green">{t("browseGuides")}</Link></div> : null}
    </section>
    <ContentFooter />
  </main>;
}
