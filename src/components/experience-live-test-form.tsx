"use client";
import { useRef,useState } from "react";
import { EnquirySelect } from "@/components/enquiry-select";
import { chinaServiceDate } from "@/lib/driver-airport-transfers";
export function ExperienceLiveTestForm({zh}:{zh:boolean}){
 const t=(en:string,cn:string)=>zh?cn:en;
 const [piece,setPiece]=useState("scarf"),[people,setPeople]=useState("1"),[review,setReview]=useState<Record<string,string>|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const id=useRef(""),code=useRef("");const inflight=useRef(false);
 const reset=()=>{setReview(null);id.current="";setError("");};
 const checkout=async()=>{if(!review||inflight.current)return;inflight.current=true;setBusy(true);setError("");try{if(!id.current)id.current=crypto.randomUUID();const r=await fetch("/api/stripe/experience-live-test-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...review,people:Number(review.people),productId:"experience-payment-test",locale:zh?"zh":"en",id:id.current,accessCode:code.current})});const d=await r.json();if(!r.ok||typeof d.url!=="string")throw Error(d.error||"Checkout unavailable");window.location.assign(d.url);}catch(e){setError(e instanceof Error?e.message:"Checkout unavailable");inflight.current=false;setBusy(false);}};
 const options=[{value:"scarf",label:t("Square scarf","方巾")},{value:"bag",label:t("Canvas bag","帆布包")},{value:"doll",label:t("Textile doll","玩偶")}];
 return <div className="driver-booking-panel" id="booking">
 <form className="contact-form driver-form" onChange={reset} onSubmit={e=>{e.preventDefault();const v=new FormData(e.currentTarget);code.current=String(v.get("accessCode")||"");setReview({name:String(v.get("name")||""),email:String(v.get("email")||""),whatsapp:String(v.get("whatsapp")||""),date:String(v.get("date")||""),time:String(v.get("time")||""),piece,people});setError("");}}>
 <h3>{t("Select your experience options","选择体验选项")}</h3><p className="driver-form-note">{t("Internal live verification. USD 1 per test order, irrespective of the sample options. No service will be arranged.","内部正式支付验收。每笔测试订单固定 US$1，与演示选项无关，不安排实际服务。")}</p>
 <EnquirySelect name="piece" label={t("Sample piece","体验作品")} placeholder={t("Select piece","选择作品")} required value={piece} onValueChange={v=>{setPiece(v);reset();}} options={options}/>
 <EnquirySelect name="people" label={t("Participants","人数")} placeholder={t("Select participants","选择人数")} required value={people} onValueChange={v=>{setPeople(v);reset();}} options={Array.from({length:6},(_,i)=>({value:String(i+1),label:String(i+1)}))}/>
 <div className="contact-field-row"><label>{t("Preferred date (China time)","期望日期（中国时间）")}<input type="date" name="date" min={chinaServiceDate()} required/></label><label>{t("Preferred time","期望时间")}<input type="time" name="time" required/></label></div>
 <label>{t("Name","姓名")}<input name="name" required maxLength={100} autoComplete="name"/></label>
 <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email"/></label>
 <label>WhatsApp ({t("optional","选填")})<input name="whatsapp" type="tel" maxLength={40} placeholder="+65 …" autoComplete="tel"/></label>
 <label>{t("Internal test access code","内部测试访问码")}<input name="accessCode" type="password" required autoComplete="off" data-clarity-mask="true"/></label>
 <label className="driver-form-consent"><input type="checkbox" required/><span>{t("I understand this is a real USD 1 charge for payment verification, not an actual booking.","我知道这是 US$1 的真实扣款测试，不是实际体验预约。")}</span></label>
 <button className="button button-blue" type="submit" disabled={busy}>{t("Review order","确认订单")} →</button>
 {review?<div className="driver-detail-note" role="status"><h3>{t("Order summary","订单确认")}</h3><p>{review.date} · {review.time} · {review.people} {t("participants","人")}</p><p>{options.find(o=>o.value===review.piece)?.label}</p><p>{t("Total due now","应付总价")} <strong>US$1.00</strong></p><button type="button" className="button button-blue" disabled={busy} onClick={checkout}>{busy?t("Opening Stripe…","正在打开 Stripe…"):t("Pay US$1 securely","安全支付 US$1")}</button></div>:null}
 {error?<p role="alert" className="contact-form-error">{error}</p>:null}
 </form></div>;
}
