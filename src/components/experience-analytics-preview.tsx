"use client";
import { useEffect,useRef } from "react";
import { experiencePreviewEvent } from "@/lib/experience-analytics";
export function ExperienceView({ids,list=false}:{ids:string[];list?:boolean}){
  const sent=useRef("");
  const key=ids.join("|")+(list?"-list":"-detail");
  useEffect(()=>{if(sent.current===key)return;sent.current=key;experiencePreviewEvent(list?"view_item_list":"view_item",{item_list_id:"yunnan-experiences",items:ids.map(id=>({item_id:id}))});},[ids,key,list]);
  return null;
}
export function ExperienceSelectLink({id,children,href,className}:{id:string;children:React.ReactNode;href:string;className:string}){
  return <a className={className} href={href} onClick={()=>experiencePreviewEvent("select_item",{item_list_id:"yunnan-experiences",items:[{item_id:id}]})}>{children}</a>;
}
