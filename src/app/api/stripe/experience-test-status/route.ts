import { testAccessId,readTestRecord,experienceTestClient,type TestOrder } from "@/lib/experience-test-server";
import { matchesPaidSession } from "@/lib/experience-test-rules.mjs";
export const runtime="nodejs";
export const dynamic="force-dynamic";
// Deliberately outside the tracked site layout: no GA, Clarity, third-party JS,
// PII or external asset requests on this capability URL.
export async function GET(request:Request){
  const access=new URL(request.url).searchParams.get("order");
  const id=access?testAccessId(access):null;
  let order:TestOrder|null=null;let paid=false;let receipt=false;
  if(id)try{
    order=await readTestRecord(id,"order") as TestOrder|null;
    const stripe=experienceTestClient();
    if(order&&stripe){const session=await stripe.checkout.sessions.retrieve(order.sessionId);paid=matchesPaidSession(order,session,false);const record=await readTestRecord(id,"paid");receipt=record?.sessionId===order.sessionId;}
  }catch{paid=false;}
  const zh=order?.selection.locale==="zh";
  const title=paid?(zh?"测试付款已验证":"Test payment verified"):(zh?"测试付款尚未验证":"Test payment not verified");
  const path=order&&/^[a-z0-9-]+$/.test(order.selection.slug)?(zh?"/zh":"")+"/experiences/"+order.selection.slug:"/yunnan-experiences";
  const html='<!doctype html><html lang="'+(zh?"zh-Hans":"en")+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+title+'</title><main><p>STRIPE SANDBOX · Hidden China Travel</p><h1>'+title+'</h1><p>'+(zh?"未进行真实扣款，也未产生实际体验预约。":"No real payment or experience reservation is made.")+'</p>'+(order&&id?'<p>'+(zh?"测试订单：":"Test order: ")+id+'</p><p>Webhook: '+(receipt?"Recorded":"Pending")+'</p>':'')+'<p><a href="'+path+'" rel="noreferrer">'+(zh?"返回特色体验":"Return to experiences")+'</a></p></main></html>';
  return new Response(html,{status:order?200:404,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"private, no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow","Content-Security-Policy":"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'","X-Content-Type-Options":"nosniff"}});
}
