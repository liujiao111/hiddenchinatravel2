"use client";
import { useEffect, useState } from "react";
import { experiencePreviewEvent } from "@/lib/experience-analytics";
import { ExperienceOrderReview } from "@/components/experience-order-review";
import { ExperienceLiveTestForm } from "@/components/experience-live-test-form";
import { Media } from "@/components/experience-media";
import { DriverPicker } from "@/components/yunnan-private-driver-booking";
import { chinaServiceDate } from "@/lib/driver-airport-transfers";
import { EnquirySelect } from "@/components/enquiry-select";
import { displayDraftPrice, type ExperienceProduct } from "@/lib/experiences";
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
  const [addons, setAddons] = useState<string[]>([]);
  const [review, setReview] = useState(false);
  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (product.packages.some(p => p.id === id)) { setPackageId(id); setPieces({}); setAddons([]); setReview(false); experiencePreviewEvent("select_experience_package",{items:[{item_id:product.slug+":"+id}]}); }
    };
    window.addEventListener("experience-package-select", select);
    return () => window.removeEventListener("experience-package-select", select);
  }, [product.packages,product.slug]);
  if (!pkg) return null;
  const update = () => setReview(false);
  const draftTotal = pkg.price?.currency === "USD" && !pkg.price.currencyPending ? "US$"+(pkg.price.min*people).toFixed(2)+(pkg.price.max!==undefined?"–"+(pkg.price.max*people).toFixed(2):"") : T("Pending confirmation","待确认");
  return <div>
    <form className="contact-form driver-form" style={review?{display:"none"}:undefined} onSubmit={e => { e.preventDefault(); setReview(true); }}>
      <h3>{T("Preview Your Experience Booking","体验预约预览")}</h3>
      <p className="driver-form-note">{T("Preview only. Prices and availability for this package are not confirmed. No payment or booking is created.","仅为展示原型，本套餐价格与可订状态待确认，预览不产生付款或真实预约。")}</p>
      <EnquirySelect name="experiencePackage" label={T("Experience package","体验套餐")} placeholder={T("Choose a package","选择套餐")} required value={packageId} onValueChange={id => { setPackageId(id); setPieces({}); setAddons([]); update(); experiencePreviewEvent("select_experience_package",{items:[{item_id:product.slug+":"+id}]}); }} options={product.packages.map(p=>({value:p.id,label:p.name[lang]}))}/>
      <p className="driver-form-selection">{displayDraftPrice(pkg,lang)}</p>
      <div className="contact-field-row">
        <div className="driver-picker-field" onChange={e=>{if(e.target instanceof HTMLInputElement){setDate(e.target.value);update();}}}><span>{T("Preferred date (China time)","期望日期（中国时间）")}</span><DriverPicker name="experienceDate" type="date" label={T("Choose date","选择日期")} min={chinaServiceDate()}/></div>
        <div className="driver-picker-field" onChange={e=>{if(e.target instanceof HTMLInputElement){setTime(e.target.value);update();}}}><span>{T("Preferred time (not availability)","期望时间（非实时库存）")}</span>{product.booking.timeSlots.length ? <select value={time} onChange={e=>{setTime(e.target.value);update();}}><option value="">{T("Select","请选择")}</option>{product.booking.timeSlots.map(s=><option key={s}>{s}</option>)}</select>:<DriverPicker name="experienceTime" type="time" label={T("Choose time","选择时间")}/>}</div>
      </div>
      <label>{T("Participants","参与人数")}<input type="number" min={1} max={product.booking.maxParticipants ?? 12} value={people} required onChange={e=>{setPeople(Math.max(1,Math.min(product.booking.maxParticipants ?? 12,Math.floor(Number(e.target.value)||1))));update();}} /></label>
      {pkg.pieces?.some(piece=>piece.media?.src) ? <div className="grid grid-cols-2 gap-4 mb-6">{pkg.pieces.filter(piece=>piece.media?.src).map(piece=><article className="driver-product" key={piece.id}><div className="driver-product-photo" style={{aspectRatio:"3 / 4"}}><Media media={piece.media??{alt:piece.name}} lang={lang} sizes="(max-width: 680px) 46vw, 240px"/></div><div className="driver-product-copy"><p>{piece.name[lang]} · {T("Example","作品示例")}</p></div></article>)}</div>:null}
      {pkg.pieces?.length ? Array.from({length:people},(_,i)=><EnquirySelect key={i} name={"piece-"+i} label={T("Piece for participant","选择作品 · 参与者")+" "+(i+1)} placeholder={T("Choose a piece","选择作品")} required value={pieces[i] ?? pkg.pieces?.[0]?.id ?? ""} onValueChange={value=>{setPieces(old=>({...old,[i]:value}));update();}} options={(pkg.pieces??[]).map(p=>({value:p.id,label:p.name[lang]}))}/>) : null}
      {pkg.pieces?.length && product.addons?.length ? <fieldset><legend>{T("Optional add-ons (draft)","可选增购（待确认）")}</legend>{product.addons.map(a=><label key={a.id} className="driver-form-consent"><input type="checkbox" checked={addons.includes(a.id)} onChange={e=>{setAddons(old=>e.target.checked?[...old,a.id]:old.filter(x=>x!==a.id));update();}}/><span>{a.title[lang]} · {T("Price to be confirmed","价格待确认")}</span></label>)}</fieldset>:null}
      <p className="driver-area-hint" aria-live="polite">{T("Draft base total (excluding unconfirmed add-ons): ","参考基础总价（不含未确认增购）：")}{draftTotal}</p>
      <button className="button button-blue" type="submit">{T("Continue to order review","下一步：核对订单")} →</button>
    </form>
    {review?<ExperienceOrderReview zh={zh} rows={[{label:T("Experience","体验"),value:pkg.name[lang]},{label:T("Date & time","日期与时间"),value:[date,time].filter(Boolean).join(" · ")||T("Not selected","未选择")},{label:T("Participants","人数"),value:String(people)},{label:T("Pieces","作品"),value:pkg.pieces?Array.from({length:people},(_,i)=>pkg.pieces?.find(p=>p.id===(pieces[i]??pkg.pieces?.[0]?.id))?.name[lang]).join(" / "):T("Custom","定制")},{label:T("Add-ons (unconfirmed)","增购（待确认）"),value:product.addons?.filter(a=>addons.includes(a.id)).map(a=>a.title[lang]).join(" / ")||"—"}]} total={draftTotal} notice={T("Draft base price only. Final price and availability require confirmation. No payment is enabled for this package.","仅为参考基础价，最终价格及可订状态待确认；本套餐尚未开放付款。")} onEdit={()=>setReview(false)}/>:null}
  </div>;
}
