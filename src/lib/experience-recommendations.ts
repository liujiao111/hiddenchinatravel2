import type { ExperienceProduct } from "./experiences";
import type { ContentItem } from "./content";

/** Only explicit editorial choices, product-to-article links, or an exact destination
 *  plus a shared theme qualify. Never infer products from incidental words in an article.
 *  Transport guides retain their driver recommendation and get no automatic experience cards.
 */
export function recommendExperiences(item: Pick<ContentItem,"slug"|"kind"|"frontmatter">, catalog: readonly ExperienceProduct[], isTransport=false, limit=3): ExperienceProduct[] {
  if(item.kind!=="article" || limit<=0)return [];
  const meta=item.frontmatter;
  const explicit=meta.relatedExperiences??[];
  const canonical=meta.translationKey??item.slug;
  const eligible=catalog.filter(p=>p.status==="published");
  const result:ExperienceProduct[]=[];
  const add=(p:ExperienceProduct|undefined)=>{if(p&&!result.some(x=>x.slug===p.slug))result.push(p)};
  for(const slug of explicit)add(eligible.find(p=>p.slug===slug));
  if(!isTransport){
    for(const p of eligible)if(p.relatedArticles?.includes(canonical)||p.relatedArticles?.includes(item.slug))add(p);
    for(const p of eligible)if(meta.experienceDestination===p.destination && meta.experienceThemes?.some(t=>p.themes.includes(t)))add(p);
  }
  return result.slice(0,Math.min(3,limit));
}
