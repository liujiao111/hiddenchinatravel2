import { liveClient,accessId,readRecord,orderUrl,settleExperienceTest,type LiveOrder } from "@/lib/experience-live-test";
import { orderResultCss } from "@/lib/order-result-ui";
import { siteConfig } from "@/lib/site-config";
import { matches } from "@/lib/experience-live-test-rules.mjs";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){
  const q=new URL(request.url).searchParams;const token=q.get("order");const id=token?accessId(token):null;
  let order:LiveOrder|null=null,paid=false,receipt=false,ops=false,guest=false;let checkout="";
  if(id)try{order=await readRecord(id,"order") as LiveOrder|null;const stripe=liveClient();if(order&&stripe){const session=await stripe.checkout.sessions.retrieve(order.sessionId);paid=matches(order,session,true);if(paid){await settleExperienceTest(session,true,"stripe-api-confirmed:"+session.id);const records=await Promise.all([readRecord(id,"paid"),readRecord(id,"operator-email"),readRecord(id,"customer-email")]);[receipt,ops,guest]=records.map(r=>r?.sessionId===session.id);}else if(session.status==="open"&&session.url&&/^https:\/\/checkout\.stripe\.com\/c\/pay\//.test(session.url)){checkout=session.url;}}}catch{console.error("[experience-live-test] Status unavailable");}
  const zh=order?.selection.locale==="zh",t=(cn:string,en:string)=>zh?cn:en;
  const headers={"Content-Type":"text/html; charset=utf-8","Cache-Control":"private, no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow, noarchive","Content-Security-Policy":"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'","X-Content-Type-Options":"nosniff"};
  if(!order||!id)return new Response("Order link not found.",{status:404,headers});
  const escape=(value:unknown)=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
  const row=(label:string,value:unknown)=>value?`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`:"";
  const s=order.selection,returned=q.get("payment"),paymentPending=!paid&&returned==="returned";
  const status=paid?t("US$1 正式测试付款成功（无实际体验预约）","US$1 live test payment successful — no experience booked"):paymentPending?t("正在核实 US$1 测试付款","Verifying US$1 test payment"):returned==="cancelled"?t("付款已取消，订单尚未付款","Checkout cancelled. Your order is unpaid."):t("订单已创建，待付款","Order created. Awaiting payment.");
  const msg=t("你好 Joy，我已完成 US$1 体验支付测试，请帮我核对结果。","Hi Joy, I've completed the US$1 experience payment test. Could you help verify it?")+"\n"+t("订单号：","Order ID: ")+id;
  const whatsAppUrl="https://wa.me/"+siteConfig.whatsappNumber+"?text="+encodeURIComponent(msg);
  const emailUrl="mailto:"+siteConfig.enquiryEmail+"?subject="+encodeURIComponent("Experience order "+id)+"&body="+encodeURIComponent(msg);
  const refresh=escape(orderUrl(id)+(paymentPending?"&payment=returned":""));
  const money=(cents:number)=>new Intl.NumberFormat(zh?"zh-CN":"en",{style:"currency",currency:"USD"}).format(cents/100);
  const piece=({scarf:t("方巾","Square scarf"),bag:t("帆布包","Canvas bag"),doll:t("玩偶","Textile doll")} as Record<string,string>)[s.piece]||s.piece;
  return new Response(`<!doctype html><html lang="${zh?"zh":"en"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t("体验订单","Experience order")} | Hidden China Travel</title><style>${orderResultCss}</style>
    <main><p>Hidden China Travel</p><h1>${t("US$1 支付测试订单","US$1 Payment Verification Order")}</h1>
    <section><strong>${t("仅用于支付验收，真实扣款 US$1。不包含实际文旅体验或有效预订；请勿安排作坊接待。","REAL US$1 payment verification only. No actual experience or reservation is included. Do not arrange workshop service.")}</strong></section>
    <p class="status ${paid?"success":"pending"}">${escape(status)}</p>
    ${paid?`<p class="subtle">${t("运营方付款通知：","Operator payment email:")} ${ops?t("已提交邮件服务","Accepted for sending"):t("尚未确认","Not yet confirmed")} | ${t("客户付款确认邮件：","Guest confirmation email:")} ${guest?t("已提交邮件服务","Accepted for sending"):t("尚未确认","Not yet confirmed")}</p>`:""}
    ${paymentPending?`<p class="subtle">${t("Stripe 付款已返回，我们正在同步支付记录。请刷新此页；付款成功前无需再次支付。","Returned from Stripe. We are reconciling your payment. Refresh this page; do not pay a second time.")} <a href="${refresh}">${t("刷新订单状态","Refresh payment status")}</a></p>`:""}
    <section><h2>${t("测试订单","Test order")}</h2><dl>
    ${row(t("订单编号","Order ID"),id)}
    ${row(t("服务项目","Service"),t("特色体验支付测试","Experience payment verification"))}
    ${row(t("测试类型","Purpose"),t("US$1 正式支付闭环验收（不提供体验服务）","US$1 live payment flow verification — NO EXPERIENCE"))}
    ${row(t("体验日期","Experience date"),s.date)}${row(t("体验时间（中国时间）","Time (China time)"),s.time)}${row(t("作品","Piece"),piece)}${row(t("人数","Participants"),s.people)}
    </dl></section>
    <section><h2>${t("支付详情","Payment summary")}</h2><div class="summary">
    <div><span class="subtle">${t("订单总额","Order total")}</span><strong>${escape(money(100))}</strong></div>
    <div><span class="subtle">${t("已收款","Paid")}</span><strong>${escape(money(paid?100:0))}</strong></div>
    <div><span class="subtle">${t("待付余额","Balance")}</span><strong>${escape(money(paid?0:100))}</strong></div></div>
    <p class="subtle">${t("这笔测试支付不对应任何实际文旅体验服务。","This verification payment does not purchase an experience.")}</p>
    ${paid?`<p class="success"><strong>${t("Stripe 付款已确认","Stripe payment confirmed")}</strong></p><p class="subtle">${t("付款记录：","Payment record:")} ${receipt?t("已记录","Recorded"):t("待同步","Pending")}</p>`:checkout&&!paymentPending?`<p><a class="button" href="${escape(checkout)}" rel="noreferrer">${t("通过 Stripe 支付","Pay with Stripe")} ${escape(money(100))}</a></p>`:""}
    <p><a href="${refresh}">${t("刷新付款状态","Refresh payment status")}</a></p></section>
    ${paid?`<section class="contact-next" aria-label="${t("付款后联系 Joy","Contact Joy after payment")}"><h2>${t("测试付款完成 · 联系 Joy","Test payment complete · Contact Joy")}</h2>
    <p>${t("这是 US$1 支付测试订单，不会安排作坊接待。若需确认测试结果或退款，请通过以下任一方式联系 Joy，并提供订单号。","This US$1 payment test does not include a workshop. To discuss verification or a test refund, contact Joy using one of the options below and provide your order ID.")}</p>
    <div class="order-reference"><strong>${t("订单号","Order ID")}:</strong><code>${escape(id)}</code></div>
    <p class="contact-hint">${t("联系时请提供上方订单号，方便快速查询；WhatsApp 按钮已自动带入订单号。","Please include this order ID in your message. The WhatsApp button automatically includes it.")}</p>
    <div class="contact-options"><div class="contact-option"><strong>WhatsApp</strong><p><a href="https://wa.me/${escape(siteConfig.whatsappNumber)}" target="_blank" rel="noopener noreferrer">+${escape(siteConfig.whatsappNumber)}</a></p><a class="button" href="${escape(whatsAppUrl)}" target="_blank" rel="noopener noreferrer">${t("发送订单号联系 Joy","Message Joy with order ID")}</a></div>
    <div class="contact-option"><strong>${t("微信 WeChat","WeChat")}</strong><p>${t("微信号","WeChat ID")}: <code>ll917961898</code></p><p class="contact-hint">${t("扫码添加 Joy，发送订单号","Scan to add Joy and send the order ID")}</p><p><a href="#experience-wechat-qr">${t("查看微信二维码","View WeChat QR code")}</a></p></div>
    <div class="contact-option"><strong>Email</strong><p><a href="mailto:${escape(siteConfig.enquiryEmail)}">${escape(siteConfig.enquiryEmail)}</a></p><a href="${escape(emailUrl)}">${t("发送包含订单号的邮件","Email Joy with order ID")}</a></div></div>
    <div class="contact-qr"><figure><figcaption>WhatsApp QR</figcaption><img src="/assets/contact/joy-whatsapp-qr.jpeg" alt="WhatsApp QR" width="240" height="240" loading="lazy"><p class="contact-hint">${t("扫码后请发送订单号","Please send your order ID after scanning")}</p></figure><figure id="experience-wechat-qr"><figcaption>${t("微信二维码","WeChat QR")}</figcaption><img src="/assets/contact/joy-wechat-qr.jpeg" alt="WeChat QR" width="240" height="240" loading="lazy"><p class="contact-hint">${t("添加好友后请发送订单号","Send your order ID after adding Joy")}</p></figure></div></section>`:""}
    <p><a href="${zh?"/zh":""}/experiences/dali-tie-dye-workshop?checkout_test=1#packages" rel="noreferrer">${t("返回测试产品","Return to test product")}</a></p></main></html>`,{headers});
}
