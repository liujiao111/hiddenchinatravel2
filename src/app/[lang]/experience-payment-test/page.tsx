import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { ExperienceLiveTestForm } from "@/components/experience-live-test-form";
import type { AppLocale } from "@/lib/i18n-seo";
import "../yunnan-private-driver/yunnan-private-driver.css";
export const metadata:Metadata={title:"Experience payment verification | Hidden China Travel",robots:{index:false,follow:false},referrer:"no-referrer"};
export default async function Page({params}:{params:Promise<{lang:AppLocale}>}){
 const {lang}=await params;setRequestLocale(lang);const zh=lang==="zh";
 return <main className="driver-page"><SiteHeader/><section className="driver-section driver-section-soft"><div className="shell"><div className="driver-section-head"><p className="kicker">INTERNAL PAYMENT VERIFICATION</p><h1>{zh?"US$1 特色体验测试产品":"US$1 Experience Test Product"}</h1><p>{zh?"真实支付验收专用。不包含任何实际体验服务。":"For live payment verification only. No actual experience is included."}</p></div><div className="driver-product-grid"><article className="driver-product"><div className="driver-product-copy"><h3>{zh?"标准体验支付测试":"Standard Experience Payment Test"}</h3><p>{zh?"选择示例作品、日期、人数，核对后在线支付。":"Choose sample options, date and participants, then review and pay online."}</p><div className="driver-product-price"><strong>US$1.00</strong></div><a href="#booking" className="button button-blue driver-product-action">{zh?"选择体验选项":"Select options"} →</a></div></article></div><ExperienceLiveTestForm zh={zh}/></div></section><ContentFooter/></main>;
}
