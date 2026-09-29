"use client";
import Image from "next/image";
import { useState } from "react";
export type ProofSlide = { src:string; alt:string; title:string; detail:string; copy?:string };
export function ProofCarousel({label,slides,variant}:{label:string;slides:ProofSlide[];variant:"portrait"|"landscape"}) {
  const [active,setActive]=useState(0), slide=slides[active];
  return <div className={`proof-carousel proof-carousel-${variant}`} role="region" aria-roledescription="carousel" aria-label={label}>
    <figure><div className="proof-carousel-image"><Image key={slide.src} src={slide.src} alt={slide.alt} fill sizes="(max-width:700px) 100vw, 50vw" unoptimized /></div><figcaption><span>{slide.detail}</span><h4>{slide.title}</h4>{slide.copy?<p>{slide.copy}</p>:null}</figcaption></figure>
    <div className="proof-carousel-controls"><span aria-live="polite">{String(active+1).padStart(2,"0")} / {String(slides.length).padStart(2,"0")}</span><div><button type="button" aria-label={`Previous ${label}`} onClick={()=>setActive((active-1+slides.length)%slides.length)}>←</button><button type="button" aria-label={`Next ${label}`} onClick={()=>setActive((active+1)%slides.length)}>→</button></div></div>
    <div className="proof-carousel-dots" aria-label="Choose photo">{slides.map((item,index)=><button key={item.src} type="button" aria-label={`Show ${item.title}, photo ${index+1}`} aria-current={index===active?"true":undefined} onClick={()=>setActive(index)}/>)}</div>
  </div>;
}
