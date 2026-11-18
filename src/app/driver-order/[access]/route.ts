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
  const t = (zhText: string, enText: string) => zh ? zhText : enText;
  const money = (fen: number) => new Intl.NumberFormat(zh ? "zh-CN" : "en", { style: "currency", currency: "CNY" }).format(fen / 100);
  const paidFen = (paid?.initial?.amount ?? 0) + (paid?.balance?.amount ?? 0);
  const payment = paid?.initial ? quote?.balance : quote?.initial;
  const payable = payment && Date.parse(payment.expiresAt) > Date.now()
    && !paid?.balance && paidFen < quote.totalFen && isDriverCheckoutUrl(payment.url);
  const row = (label: string, value: unknown) => value ? `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>` : "";
  const status = dispatch
    ? t("预订已确认", "Booking confirmed")
    : paidFen > 0 ? t("已收到付款，待确认接送安排", "Payment received. Pickup details to be confirmed.")
    : quote ? t("报价已确认，待付款", "Quote ready. Awaiting payment.")
    : t("已收到申请，待确认车源", "Request received. Checking availability.");

  return new Response(`<!doctype html><html lang="${zh ? "zh" : "en"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t("包车订单", "Driver order")} | Hidden China Travel</title>
    <style>body{margin:0;background:#f3f7fc;color:#192838;font:1rem/1.6 system-ui,sans-serif}main{max-width:46rem;margin:2rem auto;padding:0 1rem}section{background:white;border:1px solid #dce5ee;border-radius:14px;padding:clamp(1rem,4vw,2rem);margin:1rem 0}h1,h2{line-height:1.2}dl{margin:0}dl div{display:grid;grid-template-columns:minmax(7rem,1fr) 2fr;gap:1rem;border-bottom:1px solid #e7edf3;padding:.65rem 0}dt{font-weight:650}dd{margin:0;overflow-wrap:anywhere;white-space:pre-line}.button{display:inline-block;padding:.7rem 1.2rem;background:#174da3;color:white;border-radius:8px;font-weight:650}</style>
    <main><p>Hidden China Travel</p><h1>${t("包车订单", "Driver order")}</h1><p><strong>${status}</strong></p>
    <section><h2>${t("用车需求", "Trip details")}</h2><dl>
    ${row(t("申请编号", "Reference"), id)}
    ${row(t("服务", "Service"), summary.service)}
    ${row(t("日期", "Date"), summary.date)}
    ${row(t("路线", "Route"), summary.route)}
    ${row(t("上车地点", "Pickup"), summary.pickup)}
    ${row(t("送达地点", "Drop-off"), summary.dropoff)}
    ${row(t("车型", "Vehicle"), summary.vehicle)}
    ${row(t("人数", "Travellers"), summary.party)}
    ${row(t("参考价", "Guide price"), summary.guideFen > 0 ? money(summary.guideFen) : null)}</dl></section>
    ${quote ? `<section><h2>${t("正式报价与付款", "Quote and payment")}</h2><dl>
    ${row(t("已确认的服务", "Confirmed service"), quote.description)}
    ${row(t("总价", "Total"), money(quote.totalFen))}
    ${row(t("已付", "Paid"), money(paidFen))}
    ${row(t("剩余应付", "Remaining"), money(quote.totalFen - paidFen))}
    ${row(t("尾款截止时间", "Balance due"), quote.balanceDue)}
    ${row(t("退改条款", "Cancellation and changes"), quote.cancellationTerms)}</dl>
    ${payable ? `<p><a class="button" href="${escape(payment.url)}" rel="noreferrer">${t("通过 Stripe 支付", "Pay with Stripe")} ${escape(money(payment.dueFen))}</a></p>`
      : paidFen < quote.totalFen ? `<p>${t("需要付款链接时，请联系 Hidden China Travel。", "Contact Hidden China Travel if you need a payment link.")}</p>` : ""}</section>` : ""}
    ${dispatch ? `<section><h2>${t("接送安排", "Pickup arrangements")}</h2><dl>${row(t("时间与集合点", "Time and meeting point"), dispatch.pickup)}${row(t("司机联系方式", "Driver contact"), dispatch.driver)}</dl></section>` : ""}
    </main></html>`, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}
