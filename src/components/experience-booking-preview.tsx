"use client";
import { useEffect, useState } from "react";
import { experiencePreviewEvent } from "@/lib/experience-analytics";
import { ExperienceOrderReview } from "@/components/experience-order-review";
import { ExperienceLiveTestForm } from "@/components/experience-live-test-form";
import { Media } from "@/components/experience-media";
import { DriverPicker } from "@/components/yunnan-private-driver-booking";
import { chinaServiceDate } from "@/lib/driver-airport-transfers";
import { EnquirySelect } from "@/components/enquiry-select";
import { displayDraftPrice, experiencePieceCents, experienceRequestTotal, type ExperienceProduct } from "@/lib/experiences";
import { siteConfig } from "@/lib/site-config";
import type { AppLocale } from "@/lib/i18n-seo";

export function ExperiencePackageAction({ packageId, label, primary = true }: { packageId: string; label: string; primary?: boolean }) {
  return <a className={primary ? "button button-blue driver-product-action" : "button button-outline"} href="#booking-preview" onClick={() => window.dispatchEvent(new CustomEvent("experience-package-select", { detail: packageId }))}>{label} →</a>;
}

export function ExperienceBookingFlow({product,lang,showLiveTest=false}:{product:ExperienceProduct;lang:AppLocale;showLiveTest?:boolean}) {
 const [test,setTest]=useState(false);
 useEffect(()=>{const choose=(event:Event)=>setTest(showLiveTest&&(event as CustomEvent<string>).detail==="live-verification");window.addEventListener("experience-package-select",choose);return()=>window.removeEventListener("experience-package-select",choose);},[showLiveTest]);
 return <div className="driver-booking-panel" id="booking-preview" style={{scrollMarginTop:100}}><div hidden={test}><ExperienceBookingPreview product={product} lang={lang}/></div>{test?<ExperienceLiveTestForm zh={lang==="zh"} embedded/>:null}</div>;
}

export function ExperienceBookingPreview({ product, lang }: { product: ExperienceProduct; lang: AppLocale }) {
  const zh = lang === "zh";
  const T = (en: string, cn: string) => zh ? cn : en;
  const [packageId, setPackageId] = useState(product.packages[0]?.id ?? "");
  const pkg = product.packages.find(p => p.id === packageId);
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pieces, setPieces] = useState<Record<number, string>>({});
  const [addons, setAddons] = useState<Record<string,number>>({});
  const [review, setReview] = useState(false);
  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (product.packages.some(p => p.id === id)) { setPackageId(id); setPieces({}); setAddons({}); setReview(false); experiencePreviewEvent("select_experience_package",{items:[{item_id:product.slug+":"+id}]}); }
    };
    window.addEventListener("experience-package-select", select);
    return () => window.removeEventListener("experience-package-select", select);
  }, [product.packages,product.slug]);
  if (!pkg) return null;
  const update = () => setReview(false);
  const selectedPieces=Array.from({length:people},(_,i)=>pieces[i]??pkg.pieces?.[0]?.id??"");
  const selectedAddons:Record<string,number>=Object.fromEntries(Object.entries(addons).map(([id,n])=>[id,Math.min(n,people)] as const).filter(([,n])=>n>0));
  const cents=experienceRequestTotal(product,pkg.id,selectedPieces,pkg.price?selectedAddons:{});
  const draftTotal=cents===null?T("Request a quote","单独询价"):"US$"+(cents/100).toFixed(2);
  const pieceText=selectedPieces.map(id=>pkg.pieces?.find(p=>p.id===id)?.name[lang]??id).join(" / ");
  const addonText=product.addons?.filter(a=>selectedAddons[a.id]>0).map(a=>a.title[lang]+" × "+selectedAddons[a.id]).join(" / ")||"—";
  const rows=[{label:T("Experience","体验"),value:pkg.name[lang]},{label:T("Date & time","日期与时间"),value:[date,time].filter(Boolean).join(" · ")},{label:T("Participants","人数"),value:String(people)},{label:T("Pieces","作品"),value:pieceText},{label:T("Add-ons","增购"),value:addonText}];
  const requestMessage=[T("Hi! I'd like to request a Dali tie-dye booking.","你好，我想预约大理扎染体验。"),...rows.map(r=>r.label+": "+r.value),T("Catalog total: ","商品总价：")+draftTotal,T("Please confirm availability, meeting point, cancellation terms and payment details.","请确认可预约时间、集合地点、取消政策及付款方式。")].join("\n");
  const whatsappHref="https://wa.me/"+siteConfig.whatsappNumber+"?text="+encodeURIComponent(requestMessage);
  const mailHref="mailto:"+siteConfig.enquiryEmail+"?subject="+encodeURIComponent(T("Dali tie-dye booking request","大理扎染预约申请"))+"&body="+encodeURIComponent(requestMessage);
  return <div>
    <form className="contact-form driver-form" style={review?{display:"none"}:undefined} onSubmit={e => { e.preventDefault(); setReview(true); }}>
      <h3>{T("Request Your Experience Booking","申请预约体验")}</h3>
      <p className="driver-form-note">{T("Choose your pieces and preferred time. We confirm availability and terms before payment.","选择作品和期望时间，付款前由我们确认可订状态和服务条款。")}</p>
      <EnquirySelect name="experiencePackage" label={T("Experience package","体验套餐")} placeholder={T("Choose a package","选择套餐")} required value={packageId} onValueChange={id => { setPackageId(id); setPieces({}); setAddons({}); update(); experiencePreviewEvent("select_experience_package",{items:[{item_id:product.slug+":"+id}]}); }} options={product.packages.map(p=>({value:p.id,label:p.name[lang]}))}/>
      <p className="driver-form-selection">{displayDraftPrice(pkg,lang)}</p>
      <div className="contact-field-row">
        <div className="driver-picker-field" onChange={e=>{if(e.target instanceof HTMLInputElement){setDate(e.target.value);update();}}}><span>{T("Preferred date (China time)","期望日期（中国时间）")}</span><DriverPicker name="experienceDate" type="date" label={T("Choose date","选择日期")} min={chinaServiceDate()}/></div>
        <div className="driver-picker-field" onChange={e=>{if(e.target instanceof HTMLInputElement){setTime(e.target.value);update();}}}><span>{T("Preferred time (not availability)","期望时间（非实时库存）")}</span>{product.booking.timeSlots.length ? <select value={time} onChange={e=>{setTime(e.target.value);update();}}><option value="">{T("Select","请选择")}</option>{product.booking.timeSlots.map(s=><option key={s}>{s}</option>)}</select>:<DriverPicker name="experienceTime" type="time" label={T("Choose time","选择时间")}/>}</div>
      </div>
      <label>{T("Participants","参与人数")}<input type="number" min={1} max={product.booking.maxParticipants ?? 12} value={people} required onChange={e=>{setPeople(Math.max(1,Math.min(product.booking.maxParticipants ?? 12,Math.floor(Number(e.target.value)||1))));update();}} /></label>
      {pkg.pieces?.some(piece=>piece.media?.src) ? <div className="grid grid-cols-2 gap-4 mb-6">{pkg.pieces.filter(piece=>piece.media?.src).map(piece=><article className="driver-product" key={piece.id}><div className="driver-product-photo" style={{aspectRatio:"3 / 4"}}><Media media={piece.media??{alt:piece.name}} lang={lang} sizes="(max-width: 680px) 46vw, 240px"/></div><div className="driver-product-copy"><p>{piece.name[lang]} · {T("Example","作品示例")}</p></div></article>)}</div>:null}
      {pkg.pieces?.length ? Array.from({length:people},(_,i)=><EnquirySelect key={i} name={"piece-"+i} label={T("Piece for participant","选择作品 · 参与者")+" "+(i+1)} placeholder={T("Choose a piece","选择作品")} required value={pieces[i] ?? pkg.pieces?.[0]?.id ?? ""} onValueChange={value=>{setPieces(old=>({...old,[i]:value}));update();}} options={(pkg.pieces??[]).map(p=>({value:p.id,label:p.name[lang]+(experiencePieceCents(pkg,p.id)!==null?" · US$"+(experiencePieceCents(pkg,p.id)!/100).toFixed(2):"")}))}/>) : null}
      {pkg.price && pkg.pieces?.length && product.addons?.length ? <fieldset><legend>{T("Optional add-ons (with a standard package only)","随行加购（仅搭配标准套餐）")}</legend>{product.addons.map(a=><label key={a.id}>{a.title[lang]} · {a.sourcePrice} · {a.minutes} {T("min","分钟")}<input type="number" min={0} max={people} value={selectedAddons[a.id]??0} onChange={e=>{setAddons(old=>({...old,[a.id]:Math.max(0,Math.min(people,Math.floor(Number(e.target.value)||0)))}));update();}}/></label>)}</fieldset>:null}
      <p className="driver-area-hint" aria-live="polite">{T("Total (including selected add-ons): ","总价（含已选增购）：")}{draftTotal}</p>
      <button className="button button-blue" type="submit">{T("Continue to order review","下一步：核对订单")} →</button>
    </form>
    {review?<ExperienceOrderReview zh={zh} rows={rows} total={draftTotal} notice={T("Send your request to confirm availability, meeting point and cancellation terms before payment. This is not an instant booking; no charge is taken here.","发送预约申请后确认可订时间、集合地点及取消条款，再安排付款。本页面不会自动确认预约或扣款。")} onEdit={()=>setReview(false)}><a className="button button-blue" href={whatsappHref} data-cta-location="experience_booking_whatsapp">{T("Send booking request via WhatsApp","通过 WhatsApp 发送预约申请")} →</a><a className="button button-outline" href={mailHref}>{T("Send by email","通过邮件发送")}</a></ExperienceOrderReview>:null}
  </div>;
}
