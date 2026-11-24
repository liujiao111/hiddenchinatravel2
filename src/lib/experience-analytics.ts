import { analyticsDenied } from "./attribution";
import type { AnalyticsParams } from "./analytics";
type EventName="view_item_list"|"select_item"|"view_item"|"select_experience_package"|"begin_checkout";
const testId=process.env.NEXT_PUBLIC_EXPERIENCE_TEST_GA_ID;
const mainId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
let configured=false;
export function experiencePreviewEvent(event:EventName,params:AnalyticsParams){
  if(typeof window==="undefined"||analyticsDenied())return;
  // Only non-PII catalog/intent data. Never call production purchase or conversion.
  const payload={...params,experience_test:true};
  window.dispatchEvent(new CustomEvent("hct:experience-analytics-preview",{detail:{event,params:payload}}));
  if(!testId||!/^G-[A-Z0-9]+$/.test(testId)||testId===mainId||!window.gtag)return;
  if(!configured){window.gtag("config",testId,{send_page_view:false});configured=true;}
  window.gtag("event",event,{...payload,send_to:testId});
}
