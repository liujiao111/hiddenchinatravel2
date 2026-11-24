import "server-only";
import Stripe from "stripe";
import { get,put,BlobPreconditionFailedError } from "@vercel/blob";
import { createHmac,timingSafeEqual } from "node:crypto";
import { getEnquiryMailConfig } from "./enquiry-mail";
import { PURPOSE,PRODUCT,CENTS,validId,matches } from "./experience-live-test-rules.mjs";
export {PURPOSE,PRODUCT,CENTS};
const origin="https://hiddenchinatravel.com";
type Selection={productId:string;name:string;email:string;whatsapp:string;date:string;time:string;piece:string;people:number;locale:string};
export type LiveOrder={id:string;selection:Selection;sessionId:string;createdAt:string};
type Kind="order"|"paid"|"operator-email"|"customer-email";
const opts={access:"private" as const};
export function liveClient(){
  return process.env.VERCEL_ENV==="production"&&process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")&&process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET?.startsWith("whsec_")&&process.env.BLOB_READ_WRITE_TOKEN&&(process.env.DRIVER_ORDER_LINK_SECRET?.length??0)>=32?new Stripe(process.env.STRIPE_SECRET_KEY):null;
}
export function allowCheckout(code:unknown){
  const expected=process.env.EXPERIENCE_LIVE_TEST_ACCESS_CODE;
  return Boolean(liveClient()&&expected&&expected.length>=24&&typeof code==="string"&&Buffer.byteLength(code)===Buffer.byteLength(expected)&&timingSafeEqual(Buffer.from(code),Buffer.from(expected)));
}
function path(id:string,kind:Kind){if(!validId(id)||process.env.VERCEL_ENV!=="production")throw Error("Invalid live test order");return "experience-orders/production-verification/"+id+"/"+kind+".json";}
export async function readRecord(id:string,kind:Kind){const r=await get(path(id,kind),{...opts,useCache:false});return r?.statusCode===200?await new Response(r.stream).json():null;}
export async function writeRecord(id:string,kind:Kind,value:object){
  try{await put(path(id,kind),JSON.stringify(value),{...opts,allowOverwrite:false,contentType:"application/json"});return value;}
  catch(e){if(!(e instanceof BlobPreconditionFailedError))throw e;for(let i=0;i<6;i++){const saved=await readRecord(id,kind);if(saved)return saved;await new Promise(r=>setTimeout(r,50*(i+1)));}throw e;}
}
export function accessFor(id:string){if(!validId(id)||!liveClient())return null;return id+"."+createHmac("sha256",process.env.DRIVER_ORDER_LINK_SECRET!).update("experience-live-verification:"+id).digest("hex");}
export function accessId(value:string){const id=value.split(".")[0];const expected=accessFor(id);return expected&&value.length===expected.length&&/^[a-f0-9.-]+$/.test(value)&&timingSafeEqual(Buffer.from(value),Buffer.from(expected))?id:null;}
export function orderUrl(id:string){const access=accessFor(id);if(!access)throw Error("Order link unavailable");return origin+"/api/stripe/experience-live-test-status?order="+encodeURIComponent(access);}
export async function settleExperienceTest(session:Stripe.Checkout.Session,eventLive:boolean,eventId:string){
  const id=session.metadata?.order_id;
  if(typeof id!=="string"||!validId(id)||!liveClient())return new Response("Invalid verification order.",{status:422});
  try{
    const order=await readRecord(id,"order") as LiveOrder|null;
    if(!order)return new Response("Order not yet saved.",{status:503});
    if(!matches(order,session,eventLive))return new Response("Payment mismatch.",{status:422});
    const receipt=await writeRecord(id,"paid",{sessionId:session.id,amount:CENTS,currency:"usd",eventId,paidAt:new Date().toISOString()}) as {sessionId:string;amount:number};
    if(receipt.sessionId!==session.id||receipt.amount!==CENTS)return new Response("Payment conflict.",{status:422});
    const {apiKey,from,to}=getEnquiryMailConfig();
    if(!apiKey||!from||!to)throw Error("Mail configuration missing");
    const send=async(kind:"operator-email"|"customer-email",recipient:string,subject:string,text:string)=>{
      if(await readRecord(id,kind))return;
      const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json","Idempotency-Key":"experience-live-"+kind+"-"+session.id},body:JSON.stringify({from,to:[recipient],subject,text,reply_to:to}),signal:AbortSignal.timeout(5000)});
      if(!r.ok)throw Error("Mail rejected");
      await writeRecord(id,kind,{sessionId:session.id,at:new Date().toISOString()});
    };
    const s=order.selection;const link=orderUrl(id);
    await send("operator-email",to,"[TEST][PAID] Experience verification — "+id.slice(0,8),["REAL USD 1.00 VERIFICATION — NO EXPERIENCE OR DISPATCH","Order: "+id,"Name: "+s.name,"Email: "+s.email,"WhatsApp: "+s.whatsapp,"Preferred date/time: "+s.date+" "+s.time,"Participants: "+s.people,"Piece: "+s.piece,"Paid: USD 1.00","Stripe: "+session.id,link].join("\n"));
    const zh=s.locale==="zh";
    await send("customer-email",s.email,zh?"Hidden China Travel · 体验测试付款成功":"Hidden China Travel — experience test payment received",(zh?"已确认收到真实 US$1 测试付款。此订单不包含任何实际文旅体验或预约。":"Your real USD 1.00 verification payment is confirmed. No actual experience or reservation is included.")+"\n"+link);
    return Response.json({received:true});
  }catch{console.error("[experience-live-test] Receipt or email unavailable");return new Response("Retry verification webhook.",{status:503});}
}
