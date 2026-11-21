import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { getStripeTestClient } from "@/lib/stripe-test";
import { driverOrderAccess, readDriverOrder } from "@/lib/driver-orders.mjs";
import type { AppLocale } from "@/lib/i18n-seo";

export const metadata: Metadata = {
  title: "Payment status | Hidden China Travel",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ lang: AppLocale }>;
  searchParams: Promise<{ payment_link?: string; session_id?: string }>;
};

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { payment_link: paymentLink, session_id: sessionId } = await searchParams;
  setRequestLocale(lang);
  const zh = lang === "zh";
  const stripe = getStripeTestClient();
  let paid = false;
  let reference = "";
  let kunmingTest: { orderId: string; orderPath: string; webhookPaid: boolean } | null = null;
  const submittedViaPaymentLink = paymentLink === "1" && sessionId?.startsWith("cs_test_") === true;

  if (stripe && sessionId?.startsWith("cs_test_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" && session.metadata?.purpose === "driver_test_deposit";
      reference = session.id;
      const orderId = session.metadata?.order_id;
      if (session.metadata?.purpose === "kunming_transfer_preview_checkout"
          && session.metadata?.product_id === "kunming-arrival" && !session.livemode
          && session.amount_total === 100 && session.currency === "usd" && session.client_reference_id === orderId
          && orderId && /^[0-9a-f-]{36}$/i.test(orderId)) {
        const saved = await readDriverOrder(orderId);
        const access = driverOrderAccess(orderId);
        if (saved?.order?.testCheckout?.sessionId === session.id && access) {
          paid = session.payment_status === "paid";
          kunmingTest = { orderId, orderPath: `/driver-order/${access}`, webhookPaid: Boolean(saved.order.paid?.test) };
        }
      }
    } catch {
      paid = false;
    }
  }

  return <main className="payment-result-page">
    <SiteHeader />
    <section className="payment-result-section">
      <div className="narrow payment-result-card">
        {kunmingTest ? <>
          <p className="kicker">STRIPE · PREVIEW SANDBOX</p>
          <h1>{!paid ? (zh ? "测试付款尚未完成" : "Test payment is not complete")
            : kunmingTest.webhookPaid ? (zh ? "US$1 测试付款已确认" : "US$1 Test Payment Confirmed")
            : (zh ? "Stripe 已收款，正在同步订单" : "Stripe Paid — Updating Order")}</h1>
          <p>{zh ? "这是一笔 US$1 Stripe 沙盒付款，不会产生真实扣款，也不会安排车辆。" : "This is a US$1 Stripe sandbox payment: no real charge and no vehicle will be booked."}</p>
          <p>{zh ? "订单号：" : "Order ID: "}<strong>{kunmingTest.orderId}</strong></p>
          <p>{zh ? "Stripe 付款状态：" : "Stripe payment: "}{paid ? (zh ? "已付款（测试）" : "Paid (test)") : (zh ? "未完成" : "Not completed")}</p>
          <p>{zh ? "后台订单状态：" : "Stored order: "}{kunmingTest.webhookPaid ? (zh ? "Webhook 已确认收款" : "Webhook confirmed") : (zh ? "等待 Webhook 处理，可刷新页面查看" : "Awaiting Stripe webhook — refresh to check")}</p>
          <p><a href={kunmingTest.orderPath} rel="nofollow">{zh ? "查看我的测试订单" : "View my test order"}</a></p>
        </> : <>
          <p className="kicker">{paid
            ? (zh ? "STRIPE 测试付款成功" : "STRIPE TEST PAYMENT COMPLETE")
            : submittedViaPaymentLink
              ? (zh ? "STRIPE 测试付款已提交" : "STRIPE TEST PAYMENT SUBMITTED")
              : (zh ? "付款状态" : "PAYMENT STATUS")}</p>
          <h1>{paid
            ? (zh ? "USD 1 测试付款已验证" : "Your USD 1 test payment was verified")
            : submittedViaPaymentLink
              ? (zh ? "Stripe 已接收此次测试结账" : "Stripe received your test checkout")
              : (zh ? "暂时无法验证付款" : "We could not verify this payment")}</h1>
          <p>{paid
            ? (zh ? "这是测试模式付款，不构成有效定金或包车预订。正式付款流程会在车源、价格和服务内容确认后启用。" : "This was a test-mode payment. It is not a valid deposit or driver booking. Live payment will only be enabled after the car, price and service details are confirmed.")
            : submittedViaPaymentLink
              ? (zh ? "这是 USD 1 沙盒测试，不构成有效定金或包车预订。付款结果将由 Stripe 签名 Webhook 在服务端处理。" : "This was a USD 1 sandbox test, not a valid deposit or driver booking. The result is processed server-side through Stripe's signed webhook.")
              : (zh ? "没有找到有效的 Stripe 测试付款。请返回包车页面重试，或通过 WhatsApp 联系我们。" : "No valid Stripe test payment was found. Return to the driver page to try again, or contact us on WhatsApp.")}</p>
          {(reference || (submittedViaPaymentLink ? sessionId : "")) && <small>{zh ? "测试编号" : "Test reference"}: {reference || sessionId}</small>}
        </>}
        <Link className="button button-primary" href="/yunnan-private-driver">{zh ? "返回云南包车页面" : "Return to Yunnan driver services"}</Link>
      </div>
    </section>
    <ContentFooter />
  </main>;
}
