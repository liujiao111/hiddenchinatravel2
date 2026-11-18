import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { getStripeTestClient } from "@/lib/stripe-test";
import type { AppLocale } from "@/lib/i18n-seo";

export const metadata: Metadata = {
  title: "Payment status | Hidden China Travel",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ lang: AppLocale }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { session_id: sessionId } = await searchParams;
  setRequestLocale(lang);
  const zh = lang === "zh";
  const stripe = getStripeTestClient();
  let paid = false;
  let reference = "";

  if (stripe && sessionId?.startsWith("cs_test_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" && session.metadata?.purpose === "driver_test_deposit";
      reference = session.id;
    } catch {
      paid = false;
    }
  }

  return <main className="payment-result-page">
    <SiteHeader />
    <section className="payment-result-section">
      <div className="narrow payment-result-card">
        <p className="kicker">{paid ? (zh ? "STRIPE 测试付款成功" : "STRIPE TEST PAYMENT COMPLETE") : (zh ? "付款状态" : "PAYMENT STATUS")}</p>
        <h1>{paid ? (zh ? "USD 1 测试付款已验证" : "Your USD 1 test payment was verified") : (zh ? "暂时无法验证付款" : "We could not verify this payment")}</h1>
        <p>{paid
          ? (zh ? "这是测试模式付款，不构成有效定金或包车预订。正式付款流程会在车源、价格和服务内容确认后启用。" : "This was a test-mode payment. It is not a valid deposit or driver booking. Live payment will only be enabled after the car, price and service details are confirmed.")
          : (zh ? "没有找到有效的 Stripe 测试付款。请返回包车页面重试，或通过 WhatsApp 联系我们。" : "No valid Stripe test payment was found. Return to the driver page to try again, or contact us on WhatsApp.")}</p>
        {reference && <small>{zh ? "测试编号" : "Test reference"}: {reference}</small>}
        <Link className="button button-primary" href="/yunnan-private-driver">{zh ? "返回云南包车页面" : "Return to Yunnan driver services"}</Link>
      </div>
    </section>
    <ContentFooter />
  </main>;
}
