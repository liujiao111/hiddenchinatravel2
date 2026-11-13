import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { OperatorCredentials } from "@/components/operator-credentials";
import { licensedOperator } from "@/lib/journey-trust";
import type { AppLocale } from "@/lib/i18n-seo";

export const metadata: Metadata = {
  title: "Licensed Yunnan Tour Operator & Booking Information",
  description: "Verify Hidden China Travel's licensed contracting travel agency, registered business information, travel agency permit and the written quotation process.",
};

export default async function LicensedOperatorPage({ params }: { params: Promise<{lang: AppLocale}> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const zh = lang === "zh";
  return <main>
    <SiteHeader />
    <section className="section" style={{background:"#eff6f3"}}>
      <div className="shell" style={{maxWidth:950}}>
        <p className="kicker">{zh ? "签约资质与预订保障" : "LICENSED YUNNAN OPERATOR"}</p>
        <h1 style={{fontSize:"clamp(2.1rem,4vw,3.6rem)",lineHeight:1.15}}>{zh ? "持证旅行社与预订信息" : "Licensed Operator & Booking Protection"}</h1>
        <p>{zh ? "Joy 负责初步沟通与规划；云南私人行程的后续报价、签约、收付款和接待由昆明滇果果国际旅行社有限公司负责。实际服务、酒店、车辆、费用及退改条款以双方确认的书面报价和合同为准。" : "Joy handles initial enquiries and route planning. For Yunnan private journeys, Kunming Dianguoguo International Travel Agency Co., Ltd. handles subsequent quotations, contracts, payments and on-the-ground arrangements. Your named hotels, vehicle and guide arrangements, included services, total price and cancellation terms are confirmed in writing."}</p>
        <p><strong>{zh ? licensedOperator.nameZh : licensedOperator.nameEn}</strong> · {zh ? "旅行社业务经营许可证" : "Travel-agency operating permit"}: {licensedOperator.permitNumber}</p>
        <p>{zh ? "统一社会信用代码" : "Unified social credit code"}: {licensedOperator.unifiedSocialCreditCode}</p>
        <p>{zh ? "下方展示云南业务持证经营者的营业执照与旅行社业务经营许可证。云南行程包含由持证旅行社安排的责任险，承保公司和具体保障条件将在确认预订前由经营者说明。建议旅客自行购买旅行医疗及紧急救援保险。" : "The business licence and travel-agency permit of our licensed Yunnan operator are displayed below. Travel-agency liability insurance is included with Yunnan journeys; the operator provides applicable policy and coverage details before booking. Please arrange your own travel medical and emergency evacuation insurance."}</p>
        <p>{zh ? "联系 Joy 讨论私人路线：" : "Start with a suggested private route:"} <Link href="/private-yunnan-tours" style={{textDecoration:"underline"}}>{zh ? "查看云南私人定制" : "Tailor-Made Yunnan"}</Link></p>
      </div>
    </section>
    <section className="journey-proof section section-sand">
      <div className="shell"><OperatorCredentials /></div>
    </section>
    <ContentFooter />
  </main>;
}
