import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ExperienceCollection } from "@/components/experience-pages";
import { alternatesFor, type AppLocale } from "@/lib/i18n-seo";
import "../yunnan-private-driver/yunnan-private-driver.css";
type Props = { params: Promise<{ lang: AppLocale }> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {lang}=await params;
  return {title:lang==="zh"?"云南特色文旅体验":"Yunnan Local Experiences",description:lang==="zh"?"探索云南当地手工艺、美食及文化体验。":"Discover local crafts, food and cultural experiences in Yunnan.",alternates:alternatesFor(lang,"/yunnan-experiences"),robots:{index:false,follow:false}};
}
export default async function Page({params}:Props) {
  const {lang}=await params;setRequestLocale(lang);
  return <ExperienceCollection lang={lang}/>;
}
