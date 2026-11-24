"use client";
import { useEffect, useState } from "react";
import { EnquirySelect } from "@/components/enquiry-select";
import { displayDraftPrice, type ExperienceProduct } from "@/lib/experiences";
import type { AppLocale } from "@/lib/i18n-seo";

export function ExperiencePackageAction({ packageId, label, primary = true }: { packageId: string; label: string; primary?: boolean }) {
  return <a className={primary ? "button button-blue driver-product-action" : "button button-outline"} href="#booking-preview" onClick={() => window.dispatchEvent(new CustomEvent("experience-package-select", { detail: packageId }))}>{label} →</a>;
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
      if (product.packages.some(p => p.id === id)) { setPackageId(id); setPieces({}); setAddons([]); setReview(false); }
    };
    window.addEventListener("experience-package-select", select);
    return () => window.removeEventListener("experience-package-select", select);
  }, [product.packages]);
  if (!pkg) return null;
  const update = () => setReview(false);
  return <div className="driver-booking-panel" id="booking-preview">
    <form className="contact-form driver-form" onSubmit={e => { e.preventDefault(); setReview(true); }}>
      <h3>{T("Preview Your Experience Booking","体验预约预览")}</h3>
      <p className="driver-form-note">{T("Prototype only. Prices, workshop capacity and opening times are not confirmed. No order, payment or enquiry is sent.","仅为展示原型。价格、接待容量与营业时间待确认，不创建订单、不收款、不提交咨询。")}</p>
      <EnquirySelect name="experiencePackage" label={T("Experience package","体验套餐")} placeholder={T("Choose a package","选择套餐")} required value={packageId} onValueChange={id => { setPackageId(id); setPieces({}); setAddons([]); update(); }} options={product.packages.map(p=>({value:p.id,label:p.name[lang]}))}/>
      <p className="driver-form-selection">{displayDraftPrice(pkg,lang)}</p>
      <div className="contact-field-row">
        <label>{T("Preferred date","期望日期")}<input type="date" value={date} required onChange={e=>{setDate(e.target.value);update();}} /></label>
        <label>{T("Preferred time (not availability)","期望时间（非实时库存）")}{product.booking.timeSlots.length ? <select value={time} onChange={e=>{setTime(e.target.value);update();}}><option value="">{T("Select","请选择")}</option>{product.booking.timeSlots.map(s=><option key={s}>{s}</option>)}</select>:<input type="time" value={time} onChange={e=>{setTime(e.target.value);update();}}/>}</label>
      </div>
      <label>{T("Participants","参与人数")}<input type="number" min={1} max={product.booking.maxParticipants ?? 12} value={people} required onChange={e=>{setPeople(Math.max(1,Math.min(product.booking.maxParticipants ?? 12,Math.floor(Number(e.target.value)||1))));update();}} /></label>
      {pkg.pieces?.length ? Array.from({length:people},(_,i)=><EnquirySelect key={i} name={"piece-"+i} label={T("Piece for participant","选择作品 · 参与者")+" "+(i+1)} placeholder={T("Choose a piece","选择作品")} required value={pieces[i] ?? pkg.pieces?.[0]?.id ?? ""} onValueChange={value=>{setPieces(old=>({...old,[i]:value}));update();}} options={(pkg.pieces??[]).map(p=>({value:p.id,label:p.name[lang]}))}/>) : null}
      {pkg.pieces?.length && product.addons?.length ? <fieldset><legend>{T("Optional add-ons (draft)","可选增购（待确认）")}</legend>{product.addons.map(a=><label key={a.id} className="driver-form-consent"><input type="checkbox" checked={addons.includes(a.id)} onChange={e=>{setAddons(old=>e.target.checked?[...old,a.id]:old.filter(x=>x!==a.id));update();}}/><span>{a.title[lang]} · {a.sourcePrice} · {T("currency pending","币种待核实")}</span></label>)}</fieldset>:null}
      <button className="button button-blue" type="submit">{T("Review Selection","查看预约预览")} →</button>
      {review ? <div className="driver-detail-note" role="status"><strong>{pkg.name[lang]} · {date} {time} · {people} {T("participants","人")}</strong><p>{pkg.pieces ? Array.from({length:people},(_,i)=>pkg.pieces?.find(p=>p.id===(pieces[i]??pkg.pieces?.[0]?.id))?.name[lang]).join(" / ") : T("Custom piece to be discussed","定制作品待沟通")}</p><p>{T("Final price and availability require confirmation. No booking or payment was created.","最终价格与可订状态须确认；未生成预约或支付。")}</p></div>:null}
    </form>
  </div>;
}
