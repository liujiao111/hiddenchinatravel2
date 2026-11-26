"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { VehicleProof } from "@/components/vehicle-proof";
import { HashLink } from "@/components/hash-link";

const photos = {
  "terraces": "https://www.visityunnanchina.com/files/210126/Yunnan_Climate_terraced_fields_yuanyang_Yunnan.jpg",
  "town": "https://dimg04.c-ctrip.com/images/0101812000jnc9953FDFE.jpg",
  "gate": "https://dimg04.c-ctrip.com/images/0101512000jnc9jwuDEA1.jpg",
  "bridge": "https://p1-tt-ipv6.byteimg.com/origin/pgc-image/b27659b549d549ca84ec88b1d8acbd44.jpg",
  "train": "https://www.ourchinastory.com/images/cover/travel-leisure/2021/05/square/%E5%BB%BA%E6%B0%B4%E5%B0%8F%E7%81%AB%E8%BB%8A_x1.jpg",
  "village": "https://imagepphcloud.thepaper.cn/pph/image/237/13/887.jpg",
  "market": "https://static.wixstatic.com/media/a27d24_9349e5800bab479fab40a856c79118c8~mv2.jpg/v1/fill/w_750%2Ch_520%2Cal_c%2Cq_85/a27d24_9349e5800bab479fab40a856c79118c8~mv2.jpg",
  "flower": "https://photocdn.sohu.com/20160210/mp58495452_1455073932393_1_th.jpeg",
  "field": "https://www.yunnanexploration.com/wp-content/uploads/2018/07/Luositian-Field-in-Luoping-County-Qujing-05.jpg",
  "spiral": "https://ak-d.tripcdn.com/images/1mi5o12000s6qbekt5491_W_640_0_R5_Q80.jpg?proc=source%2Ftrip",
  "pottery": "https://yunnanexploration.com/wp-content/uploads/2019/07/purple-pottery-in-Jianshui-Honghe.jpg",
  "green": "https://data.travelchinaguide.com/tour/image/4974/yuanyang-rice-terraces.jpg",
  "harvest": "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/14/55/88.jpg"
};
type PhotoKey = keyof typeof photos;
type Photo = { key: PhotoKey; en: string; zh: string };
const gallery: Photo[] = [
  {key:"terraces",en:"Water-filled rice terraces, Yuanyang",zh:"元阳哈尼梯田水景"},
  {key:"town",en:"Jianshui old town at dusk",zh:"建水古城暮色"},
  {key:"village",en:"Azheke Hani village",zh:"阿者科哈尼村寨"},
  {key:"train",en:"Jianshui heritage railway",zh:"建水米轨铁路"},
  {key:"market",en:"Market day in Shengcun, Yuanyang",zh:"元阳胜村赶集日"},
  {key:"flower",en:"Seasonal canola fields, Luoping",zh:"罗平季节油菜花田"},
  {key:"bridge",en:"Shuanglong Bridge, Jianshui",zh:"建水双龙桥"},
  {key:"pottery",en:"Jianshui pottery workshop",zh:"建水紫陶工作室"},
  {key:"spiral",en:"Niujie spiral fields, Luoping",zh:"罗平牛街螺丝田"},
  {key:"green",en:"Green terraces, Yuanyang",zh:"元阳绿色梯田"},
  {key:"harvest",en:"Golden rice terraces, Yuanyang",zh:"元阳金色梯田"},
  {key:"field",en:"Rural fields around Luoping",zh:"罗平乡村田野"},
];
function PhotoImage({photo,zh,sizes="(max-width:700px) 100vw, 50vw"}:{photo:Photo;zh:boolean;sizes?:string}) {
 return <Image src={photos[photo.key]} alt={zh?photo.zh:photo.en} fill unoptimized sizes={sizes} className="object-cover" />;
}
const getPhoto=(key:PhotoKey)=>gallery.find(p=>p.key===key)!;
export function SignatureGallery({zh}:{zh:boolean}) {
 const [active,setActive]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);
 const open=(index:number)=>{setActive(index);dialog.current?.showModal();};
 const step=(direction:number)=>setActive(i=>(i+direction+gallery.length)%gallery.length);
 return <section id="photos" className="section"><div className="shell">
  <div className="journey-editorial-heading"><span>{zh?"滇南印象":"A JOURNEY IN PICTURES"}</span><h2>{zh?"发现云南不一样的一面":"A quieter, more beautiful side of Yunnan"}</h2><p>{zh?"古城、梯田、村寨、集市与季节花海。":"Ancient towns, rice terraces, village life and the colour of the seasons."}</p></div>
  <div className="signature-gallery">{gallery.slice(0,5).map((p,i)=><button key={p.key} type="button" className="signature-gallery-cell" onClick={()=>open(i)} aria-label={(zh?"查看照片：":"View photo: ")+(zh?p.zh:p.en)}><PhotoImage photo={p} zh={zh}/><span>{zh?p.zh:p.en}</span></button>)}</div>
  <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><small className="text-[var(--color-muted)]">{zh?"预览参考照片；非本团实拍。":"Preview reference photography; not guest-trip photos."}</small><button type="button" className="button button-light" onClick={()=>open(0)}>{zh?"查看全部12张照片":"View all 12 photos"}</button></div>
  <dialog ref={dialog} className="signature-photo-dialog" onKeyDown={e=>{if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1);}}><div className="signature-dialog-controls"><button type="button" onClick={()=>step(-1)} aria-label={zh?"上一张":"Previous photo"}>←</button><span>{active+1} / {gallery.length}</span><button type="button" onClick={()=>step(1)} aria-label={zh?"下一张":"Next photo"}>→</button><button type="button" onClick={()=>dialog.current?.close()} aria-label={zh?"关闭":"Close"}>×</button></div><div className="signature-dialog-image"><Image src={photos[gallery[active].key]} alt={zh?gallery[active].zh:gallery[active].en} fill unoptimized sizes="90vw" className="object-contain"/></div><p>{zh?gallery[active].zh:gallery[active].en}</p></dialog>
 </div></section>;
}
export function SignatureStories({zh}:{zh:boolean}) {
 const stories=[
  {key:"bridge" as const, en:["01 / THREE NIGHTS","Jianshui — a living ancient town","Walk historic streets, explore traditional courtyards and meet makers of tofu and purple pottery. The heritage railway and Shuanglong Bridge tell another chapter of this town's history."],zh:["01 / 三晚","建水 · 一座活着的古城","在古井、传统宅院、豆腐作坊与紫陶手艺中了解古城日常。米轨铁路和双龙桥见证另一段历史。"]},
  {key:"village" as const,en:["02 / FOUR NIGHTS","Yuanyang — landscapes shaped by generations","Stay near the UNESCO-listed Hani rice terraces. Four nights allow time for village walks, rural markets and changing light, without compulsory early starts."],zh:["02 / 四晚","元阳 · 世代耕作塑造的景观","入住世界遗产哈尼梯田附近，四晚留足时间感受村寨、乡村集市与变化的光线，日出活动并非强制。"]},
  {key:"flower" as const,en:["03 / THREE NIGHTS","Luoping — a sea of seasonal gold","Explore the karst hills, distinctive farmland and rural traditions. The canola fields are a seasonal highlight, not a guaranteed sight."],zh:["03 / 三晚","罗平 · 季节性的金色田园","探索喀斯特峰林、特色田野和乡村文化。油菜花为季节亮点，不保证盛花。"]},
 ];
 return <section className="section section-sand" id="destinations"><div className="shell"><div className="journey-editorial-heading"><span>{zh?"三处目的地":"THREE PLACES, MORE TIME"}</span><h2>{zh?"深入三种不同的文化景观":"Three landscapes, three ways of life"}</h2></div><div className="grid gap-10">{stories.map((s,i)=>{const copy=zh?s.zh:s.en;return <article key={s.key} className="signature-story"><div className={"signature-story-photo "+(i%2?"signature-story-reverse":"")}><PhotoImage photo={getPhoto(s.key)} zh={zh}/></div><div className="signature-story-copy"><span className="text-xs tracking-widest text-[var(--color-muted)]">{copy[0]}</span><h3 className="my-4 text-3xl">{copy[1]}</h3><p>{copy[2]}</p></div></article>;})}</div></div></section>;
}
export function SignatureRoute({zh}:{zh:boolean}) {
 const stops=zh?[["昆明","接客"],["建水","3晚"],["元阳","4晚"],["罗平","3晚"],["昆明机场","送机"]]:[["Kunming","Pickup"],["Jianshui","3 nights"],["Yuanyang","4 nights"],["Luoping","3 nights"],["Kunming Airport","Departure"]];
 return <section className="section" id="route"><div className="shell"><div className="journey-editorial-heading"><h2>{zh?"路线一览":"Your route at a glance"}</h2><p>{zh?"10晚，3个住宿基地，仅更换两次酒店。":"10 nights, three overnight bases, only two hotel changes."}</p></div><ol className="signature-route">{stops.map(([name,detail])=><li key={name}><strong>{name}</strong><small>{detail}</small></li>)}</ol><p className="mt-4 text-center text-sm text-[var(--color-muted)]">{zh?"元阳至罗平为最长转场，可加弥勒一晚拆分车程。":"Yuanyang to Luoping is the longest transfer; add a night in Mile if preferred."}</p></div></section>;
}
export function SignatureSeasons({zh}:{zh:boolean}) {
 const seasons=[{key:"terraces" as const,en:["Winter · Reflective terraces","November to February"],zh:["冬季 · 镜面梯田","11月至次年2月"]},{key:"flower" as const,en:["Early spring · Golden fields","Mid-February to early March"],zh:["早春 · 金色花海","2月中旬至3月上旬"]},{key:"green" as const,en:["Summer · Green terraces","June to August"],zh:["夏季 · 绿色梯田","6月至8月"]},{key:"harvest" as const,en:["Autumn · Golden rice","Harvest timing varies"],zh:["秋季 · 金色稻田","收割时间每年不同"]}];
 return <section className="section section-sand" id="seasons"><div className="shell"><div className="journey-editorial-heading"><span>{zh?"按季节出发":"TRAVEL WITH THE SEASONS"}</span><h2>{zh?"不同季节，不同的滇南":"Different seasons, different perspectives"}</h2><p>{zh?"梯田与罗平花田的综合推荐窗口为2月中旬至3月上旬，实际景观取决于天气与农作周期。":"The preferred combined window is mid-February to early March. Water levels, flowering and harvest depend on weather and farming cycles."}</p></div><div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{seasons.map(s=>{const c=zh?s.zh:s.en;return <article key={s.key} className="bg-white"><div className="relative aspect-[16/10]"><PhotoImage photo={getPhoto(s.key)} zh={zh}/></div><div className="p-5"><h3 className="text-2xl">{c[0]}</h3><p className="text-sm text-[var(--color-muted)]">{c[1]}</p></div></article>;})}</div><div className="mt-8 text-center"><HashLink className="button journey-primary-action" href="#ask-joy">{zh?"咨询适合我的旅行日期":"Check my travel dates"}</HashLink></div></div></section>;
}
export function SignatureComfort({zh}:{zh:boolean}) {
 const stays=zh?[["建水 · 3晚","古城附近精品住宿，方便步行。"],["元阳 · 4晚","优先梯田景观及可靠供暖，具体房型需确认。"],["罗平 · 3晚","舒适酒店，优先电梯与独立淋浴。"]]:[["Jianshui · 3 nights","Boutique-style accommodation near the old town."],["Yuanyang · 4 nights","Terrace-area hotel, with heating and views requested where available."],["Luoping · 3 nights","Comfortable hotel, with lift access and private shower requested."]];
 return <section className="section" id="private-journey"><div className="shell"><div className="journey-editorial-heading"><h2>{zh?"舒适而从容的旅行":"Travel in comfort"}</h2><p>{zh?"房型、酒店与车辆在正式报价中确认；以下为住宿安排原则。":"Hotels, room types and vehicles are confirmed in your written proposal. These are our accommodation priorities."}</p></div><div className="grid gap-6 md:grid-cols-3 mb-12">{stays.map(([title,copy])=><article key={title} className="border border-[var(--color-border)] p-6"><h3 className="text-2xl mb-2">{title}</h3><p>{copy}</p></article>)}</div><VehicleProof title={zh?"私人车辆与舒适转场":"Private vehicles and comfortable transfers"} copy={zh?"可按人数与行李升级商务车，具体车型以确认方案为准。":"A private vehicle suited to party size and luggage; MPV upgrades are available by quotation. Exact vehicle confirmed before travel."}/></div></section>;
}
