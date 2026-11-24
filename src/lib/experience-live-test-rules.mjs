export const PURPOSE="experience_live_verification";
export const PRODUCT="experience-payment-test";
export const CENTS=100;
export const validId=id=>typeof id==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
export function validate(body,today){
  if(!body||typeof body!=="object"||body.productId!==PRODUCT||!validId(body.id))return null;
  const {name,email,whatsapp,date,time,piece,people}=body;
  if(typeof name!=="string"||!name.trim()||name.length>100||/[\r\n]/.test(name)||typeof email!=="string"||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof whatsapp!=="string"||whatsapp.length>40||(whatsapp&&!/^\+[0-9 ().-]{7,35}$/.test(whatsapp)))return null;
  if(typeof date!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<today||date>"2099-12-31")return null;
  const parsed=new Date(date+"T00:00:00Z");if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date)return null;
  if(typeof time!=="string"||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!["scarf","bag","doll"].includes(piece)||!Number.isInteger(people)||people<1||people>6)return null;
  return {productId:PRODUCT,name:name.trim(),email:email.trim().toLowerCase(),whatsapp:whatsapp.trim(),date,time,piece,people,locale:body.locale==="zh"?"zh":"en"};
}
export function matches(order,session,live){
  return live===true&&session.livemode===true&&session.mode==="payment"&&session.payment_status==="paid"&&session.currency==="usd"&&session.amount_total===CENTS&&session.id===order.sessionId&&session.client_reference_id===order.id&&session.metadata?.purpose===PURPOSE&&session.metadata?.order_id===order.id&&session.metadata?.product_id===PRODUCT;
}
