import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ExperienceDetailTemplate } from "@/components/experience-pages";
import { experiencePath, getExperience } from "@/lib/experiences";
import { alternatesFor, type AppLocale } from "@/lib/i18n-seo";
import "../../yunnan-private-driver/yunnan-private-driver.css";
type Props = { params: Promise<{ lang: AppLocale; slug: string }> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {lang,slug}=await params;const p=getExperience(slug);if(!p)notFound();
  return {title:p.seo.title[lang],description:p.seo.description[lang],alternates:alternatesFor(lang,experiencePath(slug)),openGraph:{title:p.seo.title[lang],description:p.seo.description[lang],type:"website",...(p.hero.src?{images:[{url:p.hero.src,alt:p.hero.alt[lang]}]}:{})},robots:{index:false,follow:false}};
}
export default async function Page({params}:Props) {
  const {lang,slug}=await params;setRequestLocale(lang);
  const p=getExperience(slug);if(!p)notFound();
  return <ExperienceDetailTemplate product={p} lang={lang}/>;
}
