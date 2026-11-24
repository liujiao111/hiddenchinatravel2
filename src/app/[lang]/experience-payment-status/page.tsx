import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { testAccessId,readTestRecord,experienceTestClient,type TestOrder } from "@/lib/experience-test-server";
import { matchesPaidSession } from "@/lib/experience-test-rules.mjs";
import type { AppLocale } from "@/lib/i18n-seo";
export const metadata:Metadata={title:"Experience sandbox payment status",robots:{index:false,follow:false},referrer:"no-referrer"};
export const dynamic="force-dynamic";
export default async function Page({params,searchParams}:{params:Promise<{lang:AppLocale}>;searchParams:Promise<{order?:string}>}){
  const {lang}=await params;setRequestLocale(lang);const zh=lang==="zh";
  const T=(en:string,cn:string)=>zh?cn:en;
  const access=(await searchParams).order;
  const id=typeof access==="string"?testAccessId(access):null;
  let order:TestOrder|null=null;let paid=false;let receipt=false;
  if(id)try{
    order=await readTestRecord(id,"order") as TestOrder|null;
    const stripe=experienceTestClient();
    if(order&&stripe){const session=await stripe.checkout.sessions.retrieve(order.sessionId);paid=matchesPaidSession(order,session,false);receipt=Boolean(await readTestRecord(id,"paid"));}
  }catch{paid=false;}
  return <main className="payment-result-page"><SiteHeader/><section className="payment-result-section"><div className="narrow payment-result-card"><p className="kicker">STRIPE SANDBOX</p><h1>{paid?T("Test payment verified","测试付款已验证"):T("Test payment not verified","测试付款尚未验证")}</h1><p>{T("No real payment or experience reservation is made.","未进行真实扣款，也未产生实际体验预约。")}</p>{order?<><p>{T("Test order","测试订单")}: {order.id}</p><p>{T("Webhook receipt","Webhook 记录")}: {receipt?T("Recorded","已记录"):T("Pending","待确认")}</p></>:null}<Link className="button button-primary" href={order?"/experiences/"+order.selection.slug:"/yunnan-experiences"}>{T("Return to experiences","返回特色体验")}</Link></div></section><ContentFooter reviewsInPage/></main>;
}
