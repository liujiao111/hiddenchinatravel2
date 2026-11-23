import { driverOrderId, isDriverCheckoutUrl, readDriverOrder } from "@/lib/driver-orders.mjs";

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

  const { summary, quote, paid, dispatch } = saved.order;
  const zh = summary.locale === "zh";
  const verificationOnly = quote?.testOnly === true && summary.testOnly === true;
  const isShangriLaTransfer = summary.productId === "shangri-la-arrival";
  const t = (zhText: string, enText: string) => zh ? zhText : enText;
  const money = (fen: number) => new Intl.NumberFormat(zh ? "zh-CN" : "en", { style: "currency", currency: quote?.currency === "usd" ? "USD" : "CNY" }).format(fen / 100);
  const paidFen = (paid?.initial?.amount ?? 0) + (paid?.balance?.amount ?? 0);
  const returned = new URL(_request.url).searchParams.get("payment");
  const payment = paid?.initial ? quote?.balance : quote?.initial;
  const payable = payment && Date.parse(payment.expiresAt) > Date.now()
    && !paid?.balance && paidFen < quote.totalFen && isDriverCheckoutUrl(payment.url);
  const row = (label: string, value: unknown) => value ? `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>` : "";
  const status = dispatch
    ? t("预订已确认", "Booking confirmed")
    : paidFen > 0 ? t("已收到付款，待确认接送安排", "Payment received. Pickup details to be confirmed.")
    : quote && returned === "returned" ? t("正在核实付款，请稍后刷新此页", "Verifying payment. Please refresh shortly.")
    : quote && returned === "cancelled" ? t("付款已取消，订单尚未付款", "Checkout cancelled. Your order is unpaid.")
    : quote?.direct ? t("订单已创建，待付款", "Order created. Awaiting payment.")
    : quote ? t("报价已确认，待付款", "Quote ready. Awaiting payment.")
    : t("已收到申请，待确认车源", "Request received. Checking availability.");

  return new Response(`<!doctype html><html lang="${zh ? "zh" : "en"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t("包车订单", "Driver order")} | Hidden China Travel</title>
    <style>body{margin:0;background:#f3f7fc;color:#192838;font:1rem/1.6 system-ui,sans-serif}main{max-width:46rem;margin:2rem auto;padding:0 1rem}section{background:white;border:1px solid #dce5ee;border-radius:14px;padding:clamp(1rem,4vw,2rem);margin:1rem 0}h1,h2{line-height:1.2}dl{margin:0}dl div{display:grid;grid-template-columns:minmax(7rem,1fr) 2fr;gap:1rem;border-bottom:1px solid #e7edf3;padding:.65rem 0}dt{font-weight:650}dd{margin:0;overflow-wrap:anywhere;white-space:pre-line}.button{display:inline-block;padding:.7rem 1.2rem;background:#174da3;color:white;border-radius:8px;font-weight:650}</style>
    <main><p>Hidden China Travel</p><h1>${verificationOnly ? t("US$1 支付测试订单", "US$1 Payment Verification Order") : t("包车订单", "Driver order")}</h1>
    ${verificationOnly ? `<section><strong>${t("仅用于支付验收，真实扣款 US$1。不包含包车、接送、导游或有效预订；请勿安排司机。", "REAL US$1 payment verification only. No transport, driver, guide or reservation is included. Do not dispatch a vehicle.")}</strong></section>` : ""}
    <p><strong>${status}</strong></p>
    <section><h2>${t("用车需求", "Trip details")}</h2><dl>
    ${row(t("申请编号", "Reference"), id)}
    ${row(t("服务", "Service"), summary.service)}
    ${row(t("日期", "Date"), summary.date)}
    ${row(t("首日接客时间（中国时间）", "Pickup time (China time)"), summary.pickupTime)}
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
    ${summary.hub ? row(t("人数", "Travellers"), t(`${summary.adults} 位成人、${summary.children} 位儿童`, `${summary.adults} adults, ${summary.children} children`)) : row(t("人数", "Travellers"), summary.party)}
    ${row(t("大行李箱", "Large suitcases"), summary.luggage === undefined ? null : String(summary.luggage))}
    ${row(t("额外要求", "Other requirements"), summary.notes)}
    ${row(t(isShangriLaTransfer ? "参考价格" : "参考价", "Guide price"), summary.guideFen > 0 ? money(summary.guideFen) : summary.manualQuote ? t(isShangriLaTransfer ? "需人工确认" : "需人工确认价格", "Manual quote required") : null)}
    ${isShangriLaTransfer ? row(t("报价状态", "Quote status"), quote ? t("报价已确认", "Quote confirmed")
      : summary.manualQuote ? t("人工报价", "Manual quote") : t("待确认车源和最终价格", "Availability and final price to be confirmed")) : ""}</dl></section>
    ${quote ? `<section><h2>${t("正式报价与付款", "Quote and payment")}</h2><dl>
    ${row(t("已确认的服务", "Confirmed service"), quote.description)}
    ${row(t("总价", "Total"), money(quote.totalFen))}
    ${row(t("已付", "Paid"), money(paidFen))}
    ${row(t("剩余应付", "Remaining"), money(quote.totalFen - paidFen))}
    ${row(t("尾款截止时间", "Balance due"), quote.balanceDue)}
    ${row(t("退改条款", "Cancellation and changes"), quote.cancellationTerms)}</dl>
    ${payable ? `<p><a class="button" href="${escape(payment.url)}" rel="noreferrer">${t("通过 Stripe 支付", "Pay with Stripe")} ${escape(money(payment.dueFen))}</a></p>`
      : paidFen < quote.totalFen ? `<p>${t("需要付款链接时，请联系 Hidden China Travel。", "Contact Hidden China Travel if you need a payment link.")}</p>` : ""}</section>` : ""}
    ${!verificationOnly && dispatch ? `<section><h2>${t("接送安排", "Pickup arrangements")}</h2><dl>${row(t("时间与集合点", "Time and meeting point"), dispatch.pickup)}${row(t("司机联系方式", "Driver contact"), dispatch.driver)}</dl></section>` : ""}
    </main></html>`, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}
