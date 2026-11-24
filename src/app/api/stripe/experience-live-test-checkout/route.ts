import { chinaServiceDate } from "@/lib/driver-airport-transfers";
import { checkDriverRateLimit } from "@/lib/driver-distributed-rate-limit.mjs";
import { validate } from "@/lib/experience-live-test-rules.mjs";
import { liveClient,allowCheckout,readRecord,writeRecord,orderUrl,PURPOSE,PRODUCT,CENTS,type LiveOrder } from "@/lib/experience-live-test";
export const runtime="nodejs";
export async function POST(request:Request){
  const stripe=liveClient();
  if(!stripe||request.headers.get("origin")!=="https://hiddenchinatravel.com")return Response.json({error:"Verification unavailable."},{status:403});
  try{
    const limit=await checkDriverRateLimit(request,"experience-live-test");
    if(!limit.allowed)return Response.json({error:"Too many requests."},{status:429,headers:{"Retry-After":String(limit.retryAfter)}});
    const raw=await request.text();if(raw.length>10000)return Response.json({error:"Invalid request."},{status:400});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:"Invalid request."},{status:400});}
    if(!allowCheckout(body?.accessCode))return Response.json({error:"Invalid or disabled test access code."},{status:403});
    const selection=validate(body,chinaServiceDate());if(!selection)return Response.json({error:"Invalid selection."},{status:400});
    const id=body.id as string;const link=orderUrl(id);
    const existing=await readRecord(id,"order") as LiveOrder|null;
    if(existing){if(JSON.stringify(existing.selection)!==JSON.stringify(selection))return Response.json({error:"Request already used."},{status:409});const session=await stripe.checkout.sessions.retrieve(existing.sessionId);if(session.status==="open"&&session.url)return Response.json({url:session.url});return Response.json({url:link});}
    const metadata={purpose:PURPOSE,order_id:id,product_id:PRODUCT,test_only:"1"};
    const session=await stripe.checkout.sessions.create({mode:"payment",excluded_payment_method_types:["link"],client_reference_id:id,customer_email:selection.email,metadata,payment_intent_data:{metadata},line_items:[{quantity:1,price_data:{currency:"usd",unit_amount:CENTS,product_data:{name:"US$1 Experience Payment Verification",description:"REAL USD 1.00 test charge only. No actual experience or booking."}}}],success_url:link+"&payment=returned",cancel_url:link+"&payment=cancelled",custom_text:{submit:{message:"Real USD 1.00 test charge. No workshop, transport or reservation is included."}}},{idempotencyKey:"experience-live-verification-"+id});
    if(!session.livemode||!session.id.startsWith("cs_live_")||!session.url)throw Error("Invalid live session");
    const saved=await writeRecord(id,"order",{id,selection,sessionId:session.id,createdAt:new Date().toISOString()}) as LiveOrder;
    if(saved.sessionId!==session.id||JSON.stringify(saved.selection)!==JSON.stringify(selection))throw Error("Conflicting order");
    return Response.json({url:session.url});
  }catch{console.error("[experience-live-test] Checkout unavailable");return Response.json({error:"Checkout unavailable. Retry the same selection."},{status:503});}
}
