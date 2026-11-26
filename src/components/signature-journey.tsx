"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { VehicleProof } from "@/components/vehicle-proof";
import { HashLink } from "@/components/hash-link";

const photos = {
  "terraces": "https://www.visityunnanchina.com/files/210126/Yunnan_Climate_terraced_fields_yuanyang_Yunnan.jpg",
  "town": "https://dimg04.c-ctrip.com/images/0101812000jnc9953FDFE.jpg",
  "gate": "https://dimg04.c-ctrip.com/images/0101512000jnc9jwuDEA1.jpg",
  "bridge": "https://imgcdn.scol.com.cn/media/2024/11/14/115042037261.jpg",
  "train": "https://www.ourchinastory.com/images/cover/travel-leisure/2021/05/square/%E5%BB%BA%E6%B0%B4%E5%B0%8F%E7%81%AB%E8%BB%8A_x1.jpg",
  "village": "https://stm.sysu.edu.cn/sites/default/files/inline-images/640_2.jpg",
  "market": "https://data.travelchinaguide.com/tour/image/474202.jpg",
  "flower": "https://ak-d.tripcdn.com/images/1mi0112000rs2rstw5DBF.jpg?proc=source%2Ftrip",
  "field": "https://www.yunnanexploration.com/wp-content/uploads/2018/07/Luositian-Field-in-Luoping-County-Qujing-05.jpg",
  "spiral": "https://ak-d.tripcdn.com/images/1mi5o12000s6qbekt5491_W_640_0_R5_Q80.jpg?proc=source%2Ftrip",
  "pottery": "https://yunnanexploration.com/wp-content/uploads/2019/07/purple-pottery-in-Jianshui-Honghe.jpg",
  "green": "https://data.travelchinaguide.com/tour/image/4974/yuanyang-rice-terraces.jpg",
  "harvest": "https://x0.ifengimg.com/res/2026/22A4BB9FEEACE9ADE3507465FB179FB1A89F8171_size4362_w5616_h3744.jpg",
  "hero": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/1_yuanyang_rice_terrace_duoyishu_sunrise_2012.jpg/2560px-1_yuanyang_rice_terrace_duoyishu_sunrise_2012.jpg",
  "bridgeDetail": "https://photo.tuchong.com/3480704/f/704726583.jpg",
  "garden": "https://www.visitourchina.com/FileUpload/china-photos/cities/jianshui/zhu-family-garden/Zhu-Family-Garden_3.jpg",
  "courtyard": "https://x0.ifengimg.com/res/2020/2E5ABE306EDBB88338EDB7388634B0A515241C65_size57_w640_h427.jpeg",
  "villageDetail": "https://campus-cdhk.oss-cn-hongkong.aliyuncs.com/attachments/image/2023/07/22/b1c194bf-4f65-4324-929b-28e7d0a27281.jpg",
  "alley": "https://d.ifengimg.com/q100/img1.ugc.ifeng.com/newugc/20210107/15/wemedia/41ca4751b4536cb23b1fc1649a8414ac23152b83_size747_w1080_h720.jpg",
  "flowerDawn": "https://k.sinaimg.cn/n/sinacn/20171026/0d00-fymzzpw2499026.jpg/w700d1q75cms.jpg",
  "terraceDawn": "https://img.pconline.com.cn/images/upload/upc/tx/itbbs/1402/27/c8/31610703_1393471399344.jpg",
  "tofu": "https://static.bjd.com.cn/dams-res/mps/image/202511/21/691fece2d5de7d1434c78f50.jpg",
  "tofuDetail": "https://www.gscn.com.cn/pic/003/002/515/00300251514_b6953c68.jpg",
  "goldenRice": "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/14/55/88.jpg"
};
type PhotoKey = keyof typeof photos;
type Photo = { key: PhotoKey; en: string; zh: string };
const gallery: Photo[] = [
  {
    "key": "terraceDawn",
    "en": "Morning light at Duoyishu",
    "zh": "多依树晨光"
  },
  {
    "key": "garden",
    "en": "Moon gate at Zhu Family Garden",
    "zh": "朱家花园月门"
  },
  {
    "key": "village",
    "en": "Azheke village surrounded by rice terraces",
    "zh": "阿者科村寨与梯田"
  },
  {
    "key": "market",
    "en": "Traditional ethnic market in Yuanyang",
    "zh": "元阳民族集市"
  },
  {
    "key": "flower",
    "en": "Morning mist over Luoping's canola fields",
    "zh": "罗平油菜花田晨雾"
  },
  {
    "key": "train",
    "en": "Jianshui heritage railway",
    "zh": "建水米轨铁路"
  },
  {
    "key": "bridge",
    "en": "Sunset at Shuanglong Bridge",
    "zh": "建水双龙桥晚霞"
  },
  {
    "key": "pottery",
    "en": "Traditional Jianshui pottery",
    "zh": "建水传统紫陶"
  },
  {
    "key": "spiral",
    "en": "Niujie spiral fields",
    "zh": "牛街螺丝田"
  },
  {
    "key": "green",
    "en": "Green rice terraces",
    "zh": "绿色梯田"
  },
  {
    "key": "goldenRice",
    "en": "Golden rice terraces",
    "zh": "金色稻田"
  },
  {
    "key": "field",
    "en": "Luoping countryside",
    "zh": "罗平乡村田野"
  },
  {
    "key": "town",
    "en": "Jianshui old town",
    "zh": "建水古城"
  },
  {
    "key": "gate",
    "en": "Historic Jianshui architecture",
    "zh": "建水历史建筑"
  },
  {
    "key": "courtyard",
    "en": "Historic courtyard in Jianshui",
    "zh": "建水传统宅院"
  },
  {
    "key": "bridgeDetail",
    "en": "Shuanglong Bridge at dusk",
    "zh": "双龙桥暮色倒影"
  },
  {
    "key": "villageDetail",
    "en": "Traditional Hani homes and green fields",
    "zh": "哈尼民居与绿色田野"
  },
  {
    "key": "alley",
    "en": "Village lane in Azheke",
    "zh": "阿者科村寨街巷"
  },
  {
    "key": "flowerDawn",
    "en": "Sunrise over Luoping's karst hills",
    "zh": "罗平峰林日出"
  },
  {
    "key": "terraces",
    "en": "Water-filled rice terraces",
    "zh": "元阳镜面梯田"
  },
  {
    "key": "tofu",
    "en": "Grilled tofu in Honghe",
    "zh": "红河烧豆腐"
  },
  {
    "key": "tofuDetail",
    "en": "Jianshui grilled tofu and dipping sauces",
    "zh": "建水烧豆腐与蘸料"
  },
  {
    "key": "harvest",
    "en": "Rice harvest in Aichun village, Yuanyang",
    "zh": "元阳爱春村梯田收割"
  }
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
  <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><small className="text-[var(--color-muted)]">{zh?"目的地参考摄影，非本团实拍。":"Destination reference photography; not guest-trip photos."} <a className="underline" href="https://commons.wikimedia.org/wiki/File:1_yuanyang_rice_terrace_duoyishu_sunrise_2012.jpg" target="_blank" rel="noreferrer">Hero: Chensiyuan</a> · <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></small><button type="button" className="button button-light" onClick={()=>open(0)}>{zh?`查看全部${gallery.length}张照片`:`View all ${gallery.length} photos`}</button></div>
  <dialog ref={dialog} className="signature-photo-dialog" onKeyDown={e=>{if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1);}}><div className="signature-dialog-controls"><button type="button" onClick={()=>step(-1)} aria-label={zh?"上一张":"Previous photo"}>←</button><span>{active+1} / {gallery.length}</span><button type="button" onClick={()=>step(1)} aria-label={zh?"下一张":"Next photo"}>→</button><button type="button" onClick={()=>dialog.current?.close()} aria-label={zh?"关闭":"Close"}>×</button></div><div className="signature-dialog-image"><Image src={photos[gallery[active].key]} alt={zh?gallery[active].zh:gallery[active].en} fill unoptimized sizes="90vw" className="object-contain"/></div><p>{zh?gallery[active].zh:gallery[active].en}</p></dialog>
 </div></section>;
}
export function SignatureStories({zh}:{zh:boolean}) {
 const stories=[
  {key:"bridge" as const, en:["01 / THREE NIGHTS","Jianshui — a living ancient town","Walk historic streets, explore traditional courtyards and meet makers of tofu and purple pottery. The heritage railway and Shuanglong Bridge tell another chapter of this town's history."],zh:["01 / 三晚","建水 · 一座活着的古城","在古井、传统宅院、豆腐作坊与紫陶手艺中了解古城日常。米轨铁路和双龙桥见证另一段历史。"]},
  {key:"villageDetail" as const,en:["02 / FOUR NIGHTS","Yuanyang — landscapes shaped by generations","Stay near the UNESCO-listed Hani rice terraces. Four nights allow time for village walks, rural markets and changing light, without compulsory early starts."],zh:["02 / 四晚","元阳 · 世代耕作塑造的景观","入住世界遗产哈尼梯田附近，四晚留足时间感受村寨、乡村集市与变化的光线，日出活动并非强制。"]},
  {key:"flowerDawn" as const,en:["03 / THREE NIGHTS","Luoping — a sea of seasonal gold","Explore the karst hills, distinctive farmland and rural traditions. The canola fields are a seasonal highlight, not a guaranteed sight."],zh:["03 / 三晚","罗平 · 季节性的金色田园","探索喀斯特峰林、特色田野和乡村文化。油菜花为季节亮点，不保证盛花。"]},
 ];
 return <section className="section section-sand" id="destinations"><div className="shell"><div className="journey-editorial-heading"><span>{zh?"三处目的地":"THREE PLACES, MORE TIME"}</span><h2>{zh?"深入三种不同的文化景观":"Three landscapes, three ways of life"}</h2></div><div className="grid gap-10">{stories.map((s,i)=>{const copy=zh?s.zh:s.en;return <article key={s.key} className="signature-story"><div className={"signature-story-photo "+(i%2?"signature-story-reverse":"")}><PhotoImage photo={getPhoto(s.key)} zh={zh}/></div><div className="signature-story-copy"><span className="text-xs tracking-widest text-[var(--color-muted)]">{copy[0]}</span><h3 className="my-4 text-3xl">{copy[1]}</h3><p>{copy[2]}</p></div></article>;})}</div></div></section>;
}
type RouteStop = { photo: Photo; days: string; name: string; description: string };

function JourneyRouteOverview({zh, title, intro, stops, note}: {zh:boolean; title:string; intro:string; stops:RouteStop[]; note:string}) {
 return <section className="section" id="route" aria-labelledby="signature-route-heading"><div className="shell">
  <header className="mb-8 max-w-3xl">
   <p className="mb-3 text-xs font-semibold tracking-widest text-[var(--color-muted)]">{zh?"行程概览":"YOUR JOURNEY AT A GLANCE"}</p>
   <h2 id="signature-route-heading" className="mb-3 text-3xl md:text-4xl">{title}</h2>
   <p className="m-0 text-[var(--color-muted)]">{intro}</p>
  </header>
  <div className="mb-5 flex items-center gap-3 border-b border-[var(--color-border)] pb-4 text-sm max-[700px]:flex-wrap">
   <span className="shrink-0">{zh?"昆明接客":"Start in Kunming"}</span>
   <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]"/>
   <span className="text-center text-xs text-[var(--color-muted)]">{zh?"全程私人专车":"Private transport throughout"}</span>
   <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]"/>
   <span className="shrink-0">{zh?"昆明机场送机":"Finish at Kunming Airport"}</span>
  </div>
  <ol className="m-0 grid list-none grid-cols-3 gap-6 p-0 max-[700px]:grid-cols-1 max-[700px]:gap-0">
   {stops.map(stop=><li key={stop.name} className="min-w-0 max-[700px]:grid max-[700px]:grid-cols-[minmax(105px,36%)_minmax(0,1fr)] max-[700px]:items-start max-[700px]:gap-4 max-[700px]:border-b max-[700px]:border-[var(--color-border)] max-[700px]:py-5">
    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]"><PhotoImage photo={stop.photo} zh={zh} sizes="(max-width:700px) 36vw, (max-width:1200px) 33vw, 380px"/></div>
    <div className="pt-4 max-[700px]:pt-0">
     <p className="m-0 text-xs font-medium tracking-wide text-[var(--color-muted)]">{stop.days}</p>
     <h3 className="mb-2 mt-2 text-2xl max-[700px]:text-xl">{stop.name}</h3>
     <p className="m-0 text-sm leading-relaxed text-[var(--color-muted)]">{stop.description}</p>
    </div>
   </li>)}
  </ol>
  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5 max-[700px]:mt-2 max-[700px]:border-t-0">
   <p className="m-0 text-sm text-[var(--color-muted)]">{note}</p>
   <HashLink className="shrink-0 text-sm font-medium text-[var(--color-action-text)] underline underline-offset-4" href="#itinerary">{zh?"探索完整行程":"Explore the full itinerary"} <span aria-hidden="true">↓</span></HashLink>
  </div>
 </div></section>;
}

export function SignatureRoute({zh}:{zh:boolean}) {
 const stops:RouteStop[]=[
  {photo:getPhoto("bridge"),days:zh?"第1–3天 · 3晚":"DAYS 1–3 · 3 NIGHTS",name:zh?"建水 Jianshui":"Jianshui",description:zh?"千年古城、米轨铁路与传统紫陶工艺。":"Ancient streets, the heritage railway and traditional purple pottery."},
  {photo:getPhoto("terraces"),days:zh?"第4–7天 · 4晚":"DAYS 4–7 · 4 NIGHTS",name:zh?"元阳 Yuanyang":"Yuanyang",description:zh?"哈尼梯田、日出云海、民族村寨与乡村集市。":"Hani rice terraces, optional sunrise photography, ethnic villages and rural markets."},
  {photo:getPhoto("flowerDawn"),days:zh?"第8–10天 · 3晚":"DAYS 8–10 · 3 NIGHTS",name:zh?"罗平 Luoping":"Luoping",description:zh?"喀斯特峰林、季节性油菜花海与布依族文化。":"Karst hills, seasonal canola fields and Buyi cultural traditions."}
 ];
 return <JourneyRouteOverview zh={zh} title={zh?"三个目的地，十一天慢旅行":"Three destinations, eleven unhurried days"} intro={zh?"10晚住宿，仅更换两次酒店。从古城人文到梯田晨雾，再到罗平的田野风光。":"Ten nights and just two hotel changes, from living ancient streets to misty rice terraces and Luoping’s countryside."} stops={stops} note={zh?"第11天送机。元阳至罗平为最长转场，可增加弥勒一晚。":"Day 11: airport transfer. Yuanyang to Luoping is the longest drive; an extra night in Mile is optional."}/>;
}
export function SignatureSeasons({zh}:{zh:boolean}) {
 const seasons=[{key:"terraces" as const,en:["Winter · Reflective terraces","November to February"],zh:["冬季 · 镜面梯田","11月至次年2月"]},{key:"flower" as const,en:["Early spring · Golden fields","Mid-February to early March"],zh:["早春 · 金色花海","2月中旬至3月上旬"]},{key:"green" as const,en:["Summer · Green terraces","June to August"],zh:["夏季 · 绿色梯田","6月至8月"]},{key:"harvest" as const,en:["Autumn · Golden rice","Harvest timing varies"],zh:["秋季 · 金色稻田","收割时间每年不同"]}];
 return <section className="section section-sand" id="seasons"><div className="shell"><div className="journey-editorial-heading"><span>{zh?"按季节出发":"TRAVEL WITH THE SEASONS"}</span><h2>{zh?"不同季节，不同的滇南":"Different seasons, different perspectives"}</h2><p>{zh?"梯田与罗平花田的综合推荐窗口为2月中旬至3月上旬，实际景观取决于天气与农作周期。":"The preferred combined window is mid-February to early March. Water levels, flowering and harvest depend on weather and farming cycles."}</p></div><div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{seasons.map(s=>{const c=zh?s.zh:s.en;return <article key={s.key} className="bg-white"><div className="relative aspect-[16/10]"><PhotoImage photo={getPhoto(s.key)} zh={zh}/></div><div className="p-5"><h3 className="text-2xl">{c[0]}</h3><p className="text-sm text-[var(--color-muted)]">{c[1]}</p></div></article>;})}</div><div className="mt-8 text-center"><HashLink className="button journey-primary-action" href="#ask-joy">{zh?"咨询适合我的旅行日期":"Check my travel dates"}</HashLink></div></div></section>;
}
export function SignatureComfort({zh}:{zh:boolean}) {
 const stays=zh?[["建水 · 3晚","古城附近精品住宿，方便步行。"],["元阳 · 4晚","优先梯田景观及可靠供暖，具体房型需确认。"],["罗平 · 3晚","舒适酒店，优先电梯与独立淋浴。"]]:[["Jianshui · 3 nights","Boutique-style accommodation near the old town."],["Yuanyang · 4 nights","Terrace-area hotel, with heating and views requested where available."],["Luoping · 3 nights","Comfortable hotel, with lift access and private shower requested."]];
 return <section className="section" id="private-journey"><div className="shell"><div className="journey-editorial-heading"><h2>{zh?"舒适而从容的旅行":"Travel in comfort"}</h2><p>{zh?"房型、酒店与车辆在正式报价中确认；以下为住宿安排原则。":"Hotels, room types and vehicles are confirmed in your written proposal. These are our accommodation priorities."}</p></div><div className="grid gap-6 md:grid-cols-3 mb-12">{stays.map(([title,copy])=><article key={title} className="border border-[var(--color-border)] p-6"><h3 className="text-2xl mb-2">{title}</h3><p>{copy}</p></article>)}</div><VehicleProof title={zh?"私人车辆与舒适转场":"Private vehicles and comfortable transfers"} copy={zh?"可按人数与行李升级商务车，具体车型以确认方案为准。":"A private vehicle suited to party size and luggage; MPV upgrades are available by quotation. Exact vehicle confirmed before travel."}/></div></section>;
}
