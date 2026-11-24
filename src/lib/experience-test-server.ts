import "server-only";
import Stripe from "stripe";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sandboxAllowed, validId, TEST_CENTS, TEST_PURPOSE } from "./experience-test-rules.mjs";
import { getEnquiryMailConfig } from "./enquiry-mail";

export type TestSelection={slug:string;packageId:string;people:number;date:string;time:string;pieces:string[];addons:string[];locale:"en"|"zh"};
export type TestOrder={id:string;selection:TestSelection;sessionId:string;createdAt:string;returnOrigin:string};
const opts={access:"private" as const};
export function experienceTestClient(){
  return sandboxAllowed(process.env) && process.env.BLOB_READ_WRITE_TOKEN && (process.env.DRIVER_ORDER_LINK_SECRET?.length??0)>=32 ? new Stripe(process.env.STRIPE_SECRET_KEY!) : null;
}
function path(id:string,kind:"order"|"paid"|"operator-email"|"customer-email"){
  if(!validId(id)||process.env.VERCEL_ENV!=="preview")throw Error("Invalid sandbox order");
  return "experience-orders/preview/"+id+"/"+kind+".json";
}
export async function readTestRecord(id:string,kind:"order"|"paid"|"operator-email"|"customer-email"){
  const r=await get(path(id,kind),{...opts,useCache:false});
  return r?.statusCode===200?await new Response(r.stream).json():null;
}
export async function writeTestRecord(id:string,kind:"order"|"paid"|"operator-email"|"customer-email",value:object){
  try{await put(path(id,kind),JSON.stringify(value),{...opts,allowOverwrite:false,contentType:"application/json"});return value;}
  catch(e){if(!(e instanceof BlobPreconditionFailedError))throw e;
    for(let i=0;i<5;i++){const saved=await readTestRecord(id,kind);if(saved)return saved;await new Promise(r=>setTimeout(r,50*(i+1)));}
    throw e;
  }
}
export function testAccess(id:string){
  if(!validId(id)||!experienceTestClient())return null;
  return id+"."+createHmac("sha256",process.env.DRIVER_ORDER_LINK_SECRET!).update("experience-preview:"+id).digest("hex");
}
export function testAccessId(access:string){
  const id=access.split(".")[0];const expected=testAccess(id);
  if(!expected||! /^[a-f0-9.-]+$/.test(access)||access.length!==expected.length)return null;
  return timingSafeEqual(Buffer.from(access),Buffer.from(expected))?id:null;
}
export function safePreviewOrigin(){
  const host=process.env.VERCEL_URL;
  if(!host||! /^[a-z0-9-]+\.vercel\.app$/i.test(host))return null;
  return "https://"+host;
}
export async function notifyExperienceTest(order:TestOrder,session:Stripe.Checkout.Session){
  const config=getEnquiryMailConfig();
  if(!config.apiKey||!config.from||!config.to)throw Error("Mail unavailable");
  const access=testAccess(order.id);
  if(!access)throw Error("Order access unavailable");
  const link=order.returnOrigin+(order.selection.locale==="zh"?"/zh":"")+"/experience-payment-status?order="+encodeURIComponent(access);
  const opsText=["STRIPE SANDBOX — NO REAL PAYMENT OR BOOKING","Order: "+order.id,"Product: "+order.selection.slug,"Package: "+order.selection.packageId,"Preferred date/time: "+order.selection.date+" "+order.selection.time,"Participants: "+order.selection.people,"Pieces: "+order.selection.pieces.join(", "),"Add-ons (unpriced): "+order.selection.addons.join(", "),"Test amount: USD "+(TEST_CENTS/100).toFixed(2),"Checkout: "+session.id,"Status: verified sandbox payment; do not arrange service",link].join("\n");
  const send=async(kind:"operator-email"|"customer-email",to:string,subject:string,text:string)=>{
    if(await readTestRecord(order.id,kind))return;
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+config.apiKey,"Content-Type":"application/json","Idempotency-Key":"experience-test-"+kind+"-"+session.id},body:JSON.stringify({from:config.from,to:[to],subject,text}),signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw Error("Mail rejected");
    await writeTestRecord(order.id,kind,{sessionId:session.id,at:new Date().toISOString()});
  };
  await send("operator-email",config.to,"[SANDBOX] Experience payment verified — "+order.id.slice(0,8),opsText);
  // Never send test mail to arbitrary public addresses. The explicitly configured
  // test inbox must match the Stripe Checkout email.
  const allowed=process.env.STRIPE_EXPERIENCE_TEST_CUSTOMER_EMAIL?.trim().toLowerCase();
  const payer=session.customer_details?.email?.trim().toLowerCase();
  if(allowed && payer===allowed)await send("customer-email",allowed,"[SANDBOX] Hidden China Travel — test payment received",(order.selection.locale==="zh"?"测试支付已验证。此订单不构成真实预约，不安排服务。":"Test payment verified. No actual experience is booked.")+"\n"+link);
}
export {TEST_CENTS,TEST_PURPOSE};
