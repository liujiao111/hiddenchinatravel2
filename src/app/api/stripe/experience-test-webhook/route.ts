import Stripe from "stripe";
import { experienceTestClient, readTestRecord, writeTestRecord, notifyExperienceTest, TEST_PURPOSE, type TestOrder } from "@/lib/experience-test-server";
import { validId,matchesPaidSession } from "@/lib/experience-test-rules.mjs";
export const runtime="nodejs";
export async function POST(request:Request){
  const secret=process.env.STRIPE_EXPERIENCE_TEST_WEBHOOK_SECRET;
  if(!experienceTestClient()||!secret?.startsWith("whsec_"))return new Response("Sandbox webhook disabled.",{status:503});
  const signature=request.headers.get("stripe-signature");if(!signature)return new Response("Missing signature.",{status:400});
  let event:Stripe.Event;
  try{event=Stripe.webhooks.constructEvent(await request.text(),signature,secret);}catch{return new Response("Invalid signature.",{status:400});}
  if(event.livemode)return new Response("Live events are not accepted.",{status:400});
  if(event.type!=="checkout.session.completed"&&event.type!=="checkout.session.async_payment_succeeded")return Response.json({received:true});
  const session=event.data.object as Stripe.Checkout.Session;
  if(session.metadata?.purpose!==TEST_PURPOSE||session.payment_status!=="paid")return Response.json({received:true});
  const id=session.metadata.order_id;if(!validId(id))return new Response("Invalid order.",{status:422});
  try{
    const order=await readTestRecord(id,"order") as TestOrder|null;
    if(!order)return new Response("Order not yet saved.",{status:503});
    if(!matchesPaidSession(order,session,event.livemode))return new Response("Payment mismatch.",{status:422});
    const receipt=await writeTestRecord(id,"paid",{sessionId:session.id,amount:session.amount_total,currency:session.currency,eventId:event.id,paidAt:new Date(event.created*1000).toISOString()}) as {sessionId:string;amount:number};
    if(receipt.sessionId!==session.id||receipt.amount!==session.amount_total)return new Response("Payment conflict.",{status:422});
    await notifyExperienceTest(order,session);
    return Response.json({received:true});
  }catch{console.error("[experience-test] Receipt or notification unavailable");return new Response("Retry test webhook.",{status:503});}
}
