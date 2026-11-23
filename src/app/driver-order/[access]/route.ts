import { driverOrderId, isDriverCheckoutUrl, readDriverOrder } from "@/lib/driver-orders.mjs";
import { reconcileVerifiedDriverPayment } from "@/lib/driver-payment-reconcile";

const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
};
const escape = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

export async function GET(_request: Request, context: RouteContext<"/driver-order/[access]">) {
  const { access } = await context.params;
  const id = driverOrderId(access);
  if (!id) return new Response("Order link not found.", { status: 404, headers });

  let saved;
  try { saved = await readDriverOrder(id); }
  catch { return new Response("Order details are temporarily unavailable.", { status: 503, headers }); }
  if (!saved) return new Response("Order link not found.", { status: 404, headers });
  // This link carries a signed order token. Recover genuinely paid Stripe orders
  // from Stripe's API if webhook delivery failed; never infer payment from redirects.
  if (saved.order.quote?.direct && !saved.order.paid?.initial?.customerNotificationSentAt) {
    try {
      await reconcileVerifiedDriverPayment(saved.order);
      saved = await readDriverOrder(id) || saved;
    } catch (error) {
      console.error("[driver-order] Signed order reconciliation unavailable",{
        orderId:id,kind:error instanceof Error?error.name:"unknown",
      });
    }
  }

  const { summary, quote, paid, dispatch } = saved.order;
  const zh = summary.locale === "zh";
  const verificationOnly = quote?.testOnly === true && summary.testOnly === true;
  const usefulNotes = typeof summary.notes === "string" && !summary.notes.trim().startsWith("PRODUCT ID:") ? summary.notes.trim() : "";
  const paymentPending = Boolean(quote && !paid?.initial && new URL(_request.url).searchParams.get("payment") === "returned");
  const isShangriLaTransfer = summary.productId === "shangri-la-arrival";
  const t = (zhText: string, enText: string) => zh ? zhText : enText;
  const money = (fen: number) => new Intl.NumberFormat(zh ? "zh-CN" : "en", { style: "currency", currency: quote?.currency === "usd" ? "USD" : "CNY" }).format(fen / 100);
  const paidFen = (paid?.initial?.amount ?? 0) + (paid?.balance?.amount ?? 0);
  const returned = new URL(_request.url).searchParams.get("payment");
  const payment = paid?.initial ? quote?.balance : quote?.initial;
  const payable = payment && Date.parse(payment.expiresAt) > Date.now()
    && !paid?.balance && paidFen < quote.totalFen && isDriverCheckoutUrl(payment.url);
  const row = (label: string, value: unknown) => value ? `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>` : "";
  const status = verificationOnly && paidFen > 0
    ? t("US$1 正式测试付款成功（无用车服务）", "US$1 live test payment successful — no transport booked")
    : verificationOnly && quote?.direct && returned === "returned"
    ? t("正在核实 US$1 测试付款", "Verifying US$1 test payment")
    : dispatch
    ? t("预订已确认", "Booking confirmed")
    : paidFen > 0 ? t("已收到付款，待确认接送安排", "Payment received. Pickup details to be confirmed.")
    : quote && returned === "returned" ? t("正在核实付款，请稍后刷新此页", "Verifying payment. Please refresh shortly.")
    : quote && returned === "cancelled" ? t("付款已取消，订单尚未付款", "Checkout cancelled. Your order is unpaid.")
    : quote?.direct ? t("订单已创建，待付款", "Order created. Awaiting payment.")
    : quote ? t("报价已确认，待付款", "Quote ready. Awaiting payment.")
    : t("已收到申请，待确认车源", "Request received. Checking availability.");

  return new Response(`<!doctype html><html lang="${zh ? "zh" : "en"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t("包车订单", "Driver order")} | Hidden China Travel</title>
    <style>body{margin:0;background:#f3f7fc;color:#192838;font:1rem/1.6 system-ui,sans-serif}main{max-width:46rem;margin:2rem auto;padding:0 1rem}section{background:white;border:1px solid #dce5ee;border-radius:14px;padding:clamp(1rem,4vw,2rem);margin:1rem 0}h1,h2{line-height:1.2}.subtle{color:#59718c;font-size:.93rem}.success{color:#126647}.pending{color:#915b13}.test-banner{border-left:5px solid #d49b30}.status{font-weight:750;font-size:1.13rem}.summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.summary div{background:#f1f5fb;padding:.9rem;border-radius:9px}.summary strong{display:block;font-size:1.1rem}@media(max-width:610px){.summary{grid-template-columns:1fr}}dl{margin:0}dl div{display:grid;grid-template-columns:minmax(7rem,1fr) 2fr;gap:1rem;border-bottom:1px solid #e7edf3;padding:.65rem 0}dt{font-weight:650}dd{margin:0;overflow-wrap:anywhere;white-space:pre-line}.button{display:inline-block;padding:.7rem 1.2rem;background:#174da3;color:white;border-radius:8px;font-weight:650}</style>
    <main><p>Hidden China Travel</p><h1>${verificationOnly ? t("US$1 支付测试订单", "US$1 Payment Verification Order") : t("包车订单", "Driver order")}</h1>
    ${verificationOnly ? `<section><strong>${t("仅用于支付验收，真实扣款 US$1。不包含包车、接送、导游或有效预订；请勿安排司机。", "REAL US$1 payment verification only. No transport, driver, guide or reservation is included. Do not dispatch a vehicle.")}</strong></section>` : ""}
    <p class="status ${paidFen>0?"success":"pending"}">${escape(status)}</p>
    ${verificationOnly && paidFen>0 ? `<p class="subtle">
      ${t("运营方付款通知：","Operator payment email:")} ${paid?.initial?.notificationSentAt ? t("已提交邮件服务","Accepted for sending") : t("尚未确认","Not yet confirmed")}
      |
      ${t("客户付款确认邮件：","Guest confirmation email:")} ${paid?.initial?.customerNotificationSentAt ? t("已提交邮件服务","Accepted for sending") : t("尚未确认","Not yet confirmed")}
    </p>` : ""}
    ${paymentPending ? `<p class="subtle">${t("Stripe 付款已返回，我们正在同步支付记录。请刷新此页；付款成功前无需再次支付。", "Returned from Stripe. We are reconciling your payment. Refresh this page; do not pay a second time.")} <a href="${escape(new URL(_request.url).pathname)}">${t("刷新订单状态", "Refresh payment status")}</a></p>` : ""}
    <section><h2>${verificationOnly ? t("测试订单", "Test order") : t("行程详情", "Trip details")}</h2><dl>
    ${row(t("订单编号", "Order ID"), id)}
    ${row(t("服务项目", "Service"), summary.service)}
    ${verificationOnly ? row(t("测试类型", "Purpose"), t("US$1 正式支付闭环验收（不提供交通服务）", "US$1 live payment flow verification — NO TRANSPORT"))
      : `
    ${row(t("日期", "Travel date"), summary.date)}
    ${row(t("接客时间（中国时间）", "Pickup time (China time)"), summary.pickupTime)}
    ${row(t("路线", "Route"), summary.route)}
    ${row(t("交通枢纽", "Airport or railway station"), summary.hub)}
    ${row(t("接送方向", "Transfer direction"), summary.direction)}
    ${row(t("酒店区域", "Hotel area"), summary.area)}
    ${row(t("酒店名称或地址", "Hotel name or address"), summary.hotel)}
    ${row(summary.transportLabel, summary.transportNumber || (summary.transportLabel ? t("未确认", "Not confirmed") : null))}
    ${row(summary.timeLabel, summary.time ? `${summary.time} ${t("（中国时间）", "(China time)")}` : null)}
    ${row(t("上车地点", "Pickup"), summary.pickup)}
    ${row(t("送达地点", "Drop-off"), summary.dropoff)}
    ${row(t("车型", "Vehicle"), summary.vehicle)}
    ${row(t("人数", "Travellers"), summary.party)}
    ${row(t("其他要求", "Other requirements"), usefulNotes)}
    `}</dl></section>
    ${quote ? `<section>
      <h2>${t("支付详情", "Payment summary")}</h2>
      <div class="summary">
        <div><span class="subtle">${t("订单总额","Order total")}</span><strong>${escape(money(quote.totalFen))}</strong></div>
        <div><span class="subtle">${t("已收款","Paid")}</span><strong>${escape(money(paidFen))}</strong></div>
        <div><span class="subtle">${t("待付余额","Balance")}</span><strong>${escape(money(Math.max(0,quote.totalFen-paidFen)))}</strong></div>
      </div>
      <p class="subtle">${verificationOnly ? t("这笔测试支付不对应任何交通服务。","This verification payment does not purchase transport.") : t("付款不代表司机和车辆已经确认，具体派车信息将另行通知。","Payment received does not mean a driver has been assigned. Pickup arrangements follow separately.")}</p>
      ${paidFen>0 ? `<p class="success"><strong>${t("Stripe 付款已确认", "Stripe payment confirmed")}</strong></p>` : ""}
      ${!verificationOnly && quote.balanceDue ? `<p>${t("尾款支付安排","Balance arrangements")}: ${escape(quote.balanceDue)}</p>` : ""}
      ${!verificationOnly ? `<details><summary>${t("退改条款", "Cancellation and changes")}</summary><p>${escape(quote.cancellationTerms)}</p></details>` : ""}
      ${payable && !paymentPending ? `<p><a class="button" href="${escape(payment.url)}" rel="noreferrer">${t("通过 Stripe 支付","Pay with Stripe")} ${escape(money(payment.dueFen))}</a></p>`
        : !paidFen && !paymentPending ? `<p class="subtle">${t("付款链接已不可用，请联系 Hidden China Travel 获取帮助。", "Your payment link is unavailable. Contact Hidden China Travel for assistance.")}</p>` : ""}
    </section>` : ""}
    ${!verificationOnly && dispatch ? `<section><h2>${t("接送安排", "Pickup arrangements")}</h2><dl>${row(t("时间与集合点", "Time and meeting point"), dispatch.pickup)}${row(t("司机联系方式", "Driver contact"), dispatch.driver)}</dl></section>` : ""}
    </main></html>`, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}
