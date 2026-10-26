"use client";
import { useEffect, useState } from "react";
export function StoryReadingProgress() {
 const [progress,setProgress]=useState(0);
 useEffect(()=>{const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)}},[]);
 return <div className="journal-progress" aria-hidden="true"><span style={{width:`${progress}%`}}/></div>;
}
export function StoryShareButton({title}:{title:string}) {
 const [label,setLabel]=useState("Share story");
 async function share(){try{if(navigator.share){await navigator.share({title,url:window.location.href});return}await navigator.clipboard.writeText(window.location.href);setLabel("Link copied");window.setTimeout(()=>setLabel("Share story"),2200)}catch{setLabel("Share story");}}
 return <button className="journal-share" type="button" onClick={share} aria-label="Share this travel story"><span aria-hidden="true">↗</span>{label}</button>;
}