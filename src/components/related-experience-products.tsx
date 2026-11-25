import { Link } from "@/i18n/navigation";
import { CatalogProductCard } from "@/components/catalog-product-card";
import { experiencePath, experienceStartingPrice, type ExperienceProduct } from "@/lib/experiences";
import type { AppLocale } from "@/lib/i18n-seo";

/** Shared editorial recommendations; uses the commerce card, not a new visual system. */
export function RelatedExperienceProducts({ products, lang, location, id="related-experiences" }: { products:readonly ExperienceProduct[]; lang:AppLocale; location:"article_related_experience"|"yunnan_hub_experience"; id?:string }) {
  const items=products.filter(p=>p.status==="published").slice(0,3);
  if(!items.length)return null;
  const zh=lang==="zh";
  return <section className="article-discovery article-explore" id={id}>
    <div className="shell">
      <header className="article-flow-heading">
        <h2>{zh?"值得体验的云南当地活动":"Local Experiences to Explore"}</h2>
        <p>{zh?"亲身参与当地文化，选择适合自己旅行节奏的体验。":"Make time for local culture and hands-on activities at your own pace."}</p>
      </header>
      <div className="article-guide-grid">
        {items.map(p=><CatalogProductCard key={p.slug} image={p.hero.src} imageAlt={p.hero.alt[lang]} title={p.title[lang]} meta={p.city[lang]+" · "+p.duration[lang]} description={p.description[lang]} price={<div className="catalog-product-price"><strong>{experienceStartingPrice(p,lang)}</strong></div>} action={<Link className="button button-blue catalog-product-action" href={experiencePath(p.slug)} data-cta-location={location}>{zh?"查看体验":"Explore this experience"} →</Link>}/>)}
      </div>
      <div className="article-secondary-link"><Link href="/yunnan-experiences" data-cta-location={location+"_collection"}>{zh?"查看全部云南特色体验":"Explore all Yunnan experiences"} →</Link></div>
    </div>
  </section>;
}
