// Pure validation rules for an isolated sandbox checkout. No live price is implied.
export const TEST_CENTS=100;
export const TEST_PURPOSE="experience_sandbox_checkout";
export const sandboxAllowed=(env)=>env.VERCEL_ENV==="preview" && env.STRIPE_SECRET_KEY?.startsWith("sk_test_")===true && env.STRIPE_EXPERIENCE_TEST_ENABLED==="true";
export const validId=(id)=>typeof id==="string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
export function validateSelection(input,product,today) {
  if(!input || typeof input!=="object" || Array.isArray(input) || !product || input.slug!==product.slug || !validId(input.requestId)) return null;
  const pkg=product.packages.find(p=>p.id===input.packageId);
  if(!pkg || !pkg.pieces?.length || !Number.isSafeInteger(input.people) || input.people<1 || input.people>Math.min(product.booking.maxParticipants??12,12)) return null;
  if(typeof input.date!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || input.date<today || input.date>"2099-12-31") return null;
  const parsed=new Date(input.date+"T00:00:00Z");
  if(!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10)!==input.date) return null;
  if(typeof input.time!=="string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time) || (product.booking.timeSlots.length && !product.booking.timeSlots.includes(input.time))) return null;
  if(!Array.isArray(input.pieces) || input.pieces.length!==input.people || !input.pieces.every(id=>pkg.pieces.some(p=>p.id===id))) return null;
  if(!Array.isArray(input.addons) || new Set(input.addons).size!==input.addons.length || !input.addons.every(id=>product.addons?.some(a=>a.id===id))) return null;
  return {slug:product.slug,packageId:pkg.id,people:input.people,date:input.date,time:input.time,pieces:input.pieces,addons:input.addons,locale:input.locale==="zh"?"zh":"en"};
}
export function matchesPaidSession(order,session,eventLive) {
  return eventLive===false && session.livemode===false && session.mode==="payment" && session.payment_status==="paid" && session.currency==="usd" && session.amount_total===TEST_CENTS && session.id===order.sessionId && session.client_reference_id===order.id && session.metadata?.purpose===TEST_PURPOSE && session.metadata?.order_id===order.id && session.metadata?.product_id===order.selection.slug;
}
