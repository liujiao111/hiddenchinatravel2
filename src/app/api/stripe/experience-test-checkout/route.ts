import { getExperience } from "@/lib/experiences";
import { chinaServiceDate } from "@/lib/driver-airport-transfers";
import { checkDriverRateLimit } from "@/lib/driver-distributed-rate-limit.mjs";
import { validateSelection } from "@/lib/experience-test-rules.mjs";
import { experienceTestClient, safePreviewOrigin, testAccess, readTestRecord, writeTestRecord, TEST_CENTS, TEST_PURPOSE, type TestOrder } from "@/lib/experience-test-server";

export const runtime="nodejs";
export async function POST(request:Request){
  const stripe=experienceTestClient();const origin=safePreviewOrigin();
  if(!stripe||!origin)return Response.json({error:"Experience sandbox is disabled."},{status:503});
  if(request.headers.get("origin")!==origin && request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Invalid origin."},{status:403});
  try{
    const limit=await checkDriverRateLimit(request,"experience-checkout");
    if(!limit.allowed)return Response.json({error:"Too many requests."},{status:429,headers:{"Retry-After":String(limit.retryAfter)}});
    const raw=await request.text();if(raw.length>10000)return Response.json({error:"Invalid request."},{status:400});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:"Invalid request."},{status:400});}
    const product=typeof body?.slug==="string"?getExperience(body.slug):undefined;
    const selection=validateSelection(body,product,chinaServiceDate());
    if(!selection||!product)return Response.json({error:"Invalid experience selection."},{status:400});
    const id=body.requestId as string;
    const access=testAccess(id);if(!access)throw Error("Access unavailable");
    const existing=await readTestRecord(id,"order") as TestOrder|null;
    if(existing){
      if(JSON.stringify(existing.selection)!==JSON.stringify(selection))return Response.json({error:"Request ID already used."},{status:409});
      const session=await stripe.checkout.sessions.retrieve(existing.sessionId);
      if(session.status==="open"&&session.url)return Response.json({url:session.url});
      return Response.json({url:existing.returnOrigin+"/api/stripe/experience-test-status?order="+encodeURIComponent(access)});
    }
    const prefix=selection.locale==="zh"?"/zh":"";
    const metadata={purpose:TEST_PURPOSE,order_id:id,product_id:product.slug};
    const session=await stripe.checkout.sessions.create({
      mode:"payment",payment_method_types:["card"],client_reference_id:id,
      line_items:[{quantity:1,price_data:{currency:"usd",unit_amount:TEST_CENTS,product_data:{name:"SANDBOX — Experience payment test",description:"No real booking, no service, USD 1 test only"}}}],
      metadata,payment_intent_data:{metadata},
      success_url:origin+"/api/stripe/experience-test-status?order="+encodeURIComponent(access),
      cancel_url:origin+prefix+"/experiences/"+product.slug+"?payment=cancelled#booking-preview",
      custom_text:{submit:{message:"Sandbox test only. No actual service is booked."}}
    },{idempotencyKey:"experience-sandbox-"+id});
    if(session.livemode||!session.url||!session.id.startsWith("cs_test_"))throw Error("Unexpected Stripe mode");
    const saved=await writeTestRecord(id,"order",{id,selection,sessionId:session.id,createdAt:new Date().toISOString(),returnOrigin:origin}) as TestOrder;
    if(saved.sessionId!==session.id||JSON.stringify(saved.selection)!==JSON.stringify(selection))throw Error("Conflicting order");
    return Response.json({url:session.url});
  }catch{console.error("[experience-test] Checkout unavailable");return Response.json({error:"Sandbox checkout unavailable. Retry the same selection."},{status:503});}
}
