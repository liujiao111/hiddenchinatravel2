import { get, put, BlobPreconditionFailedError } from "@vercel/blob";

const opts = { access: /** @type {const} */ ("private") };
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const stages = ["initial", "balance"];
const kinds = ["paid", "operator-email", "customer-email", "ga4-purchase"];
/** @param {string} id @param {string} stage @param {string} kind */
function path(id,stage,kind) {
  if (!idPattern.test(id) || !stages.includes(stage) || !kinds.includes(kind)) throw new Error("Invalid payment record");
  const env = process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV || "development";
  if (!["production","preview","development"].includes(env)) throw new Error("Invalid order environment");
  return `driver-payments/${env}/${id}/${stage}-${kind}.json`;
}
/** @param {string} id @param {string} stage @param {string} kind */
export async function getDriverPaymentRecord(id,stage,kind) {
  const r = await get(path(id,stage,kind), {...opts,useCache:false});
  return r?.statusCode === 200 ? await new Response(r.stream).json() : null;
}
/** @param {string} id @param {string} stage @param {string} kind @param {object} value */
export async function createDriverPaymentRecord(id,stage,kind,value) {
  const saved = await getDriverPaymentRecord(id,stage,kind);
  if (saved) return saved;
  try {
    await put(path(id,stage,kind),JSON.stringify(value),{
      ...opts,allowOverwrite:false,contentType:"application/json",
    });
    return value;
  } catch(error) {
    if (!(error instanceof BlobPreconditionFailedError)) throw error;
    for (let i=0;i<5;i++) {
      const found=await getDriverPaymentRecord(id,stage,kind);
      if(found) return found;
      await new Promise(resolve=>setTimeout(resolve,50*(i+1)));
    }
    throw error;
  }
}
/** @param {any} order */
export async function mergeDriverPaymentRecords(order) {
  const paid={...order.paid};
  for(const stage of stages) {
    const receipt=await getDriverPaymentRecord(order.id,stage,"paid");
    if(!receipt) continue;
    const [operator,customer]=await Promise.all([
      getDriverPaymentRecord(order.id,stage,"operator-email"),
      getDriverPaymentRecord(order.id,stage,"customer-email"),
    ]);
    paid[stage]={...paid[stage],...receipt,
      ...(operator?{notificationSentAt:operator.at}:{}),
      ...(customer?{customerNotificationSentAt:customer.at}:{})};
  }
  return {...order,...(Object.keys(paid).length?{paid}:{})};
}
