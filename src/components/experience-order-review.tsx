"use client";
import { useEffect,useRef,type ReactNode } from "react";
export function ExperienceOrderReview({zh,rows,total,notice,onEdit,children}:{zh:boolean;rows:{label:string;value:string}[];total:string;notice:string;onEdit:()=>void;children?:ReactNode}){
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:"start"});},[]);
 return <section className="contact-form driver-form" aria-labelledby="experience-review-title">
 <p className="kicker">{zh?"第 2 步 / 核对订单":"STEP 2 / REVIEW"}</p>
 <h3 id="experience-review-title" ref={heading} tabIndex={-1} style={{scrollMarginTop:110}}>{zh?"核对订单信息":"Review your order"}</h3>
 <div className="driver-list-card"><dl className="grid gap-3">{rows.map(row=><div key={row.label} className="flex flex-wrap justify-between gap-2"><dt>{row.label}</dt><dd className="font-semibold break-all text-right">{row.value}</dd></div>)}</dl></div>
 <div className="flex flex-wrap justify-between items-center gap-3"><strong>{zh?"订单总价":"Order total"}</strong><strong className="text-2xl">{total}</strong></div>
 <p className="driver-form-note">{notice}</p>
 {children}
 <button type="button" className="button button-outline" onClick={onEdit}>{zh?"← 返回修改信息":"← Edit booking details"}</button>
 </section>;
}
