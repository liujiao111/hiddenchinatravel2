"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hotelProof, vehicleProof } from "@/lib/journey-trust";
import { getVehicleProof } from "@/lib/journey-trust-i18n";

type Category = "travelers" | "vehicles" | "hotels" | "planning";
type Evidence = {
  src: string;
  alt: string;
  altZh?: string;
  title: string;
  detail: string;
  copy: string;
};
const categories: { id: Category; label: string }[] = [
  { id: "travelers", label: "Guest Journeys" },
  { id: "vehicles", label: "Vehicles" },
  { id: "hotels", label: "Hotels" },
  { id: "planning", label: "Planning" },
];

// These six photos are already present in the site's guest-photo directory.
// The project requires permission before publishing customer photos; no names,
// locations, dates or links to specific testimonial authors are assumed.
const travelers: Evidence[] = [
  "客户1.1.webp", "客户1.2.webp", "客户1.3.webp",
  "客户2.1.webp", "客户2.2.webp", "客户2.3.webp",
].map((file, index) => ({
  src: `/assets/customers/${file}`,
  alt: `Guest photograph from existing Yunnan travel records, image ${index + 1}`,
  title: `Travelers in Yunnan · Photo ${index + 1}`,
  detail: `Guest photo set ${index < 3 ? "01" : "02"}`,
  copy: "Guest photograph from our existing travel materials. Personal identities and exact trip details are not disclosed.",
}));

const vehiclePhotos: Evidence[] = vehicleProof.groups.flatMap(group =>
  group.slides.map(slide => ({
    src: slide.src, alt: slide.alt, title: slide.title,
    detail: slide.detail,
    copy: slide.copy || "A vehicle example from our local transport options.",
  }))
);
const vehiclePhotosZh: Evidence[] = getVehicleProof("zh").groups.flatMap(group =>
  group.slides.map(slide => ({
    src: slide.src, alt: slide.alt, title: slide.title,
    detail: slide.detail,
    copy: slide.copy || "七座商务车参考照片。",
  }))
);
const hotelPhotos: Evidence[] = hotelProof.groups.flatMap(group =>
  group.slides.slice(0, 3).map(slide => ({
    src: slide.src, alt: slide.alt, title: slide.title,
    detail: slide.detail,
    copy: slide.copy || "A hotel example; availability is subject to your dates.",
  }))
);
const planningDocuments: Evidence[] = [
  {
    src: "/assets/planning/whatsapp-local-food-recommendations.webp",
    alt: "WhatsApp conversation sharing local food recommendations for Kunming and Dali",
    altZh: "WhatsApp 聊天记录中分享昆明与大理当地美食推荐",
    title: "Local recommendations shared with a guest",
    detail: "Guest communication · food suggestions",
    copy: "A real planning conversation in which Joy shares local food suggestions for Kunming and Dali.",
  },
  {
    src: "/assets/planning/whatsapp-private-itinerary-planning.webp",
    alt: "WhatsApp conversation about a private guide, selected hotels and a Yunnan itinerary PDF",
    altZh: "WhatsApp 聊天记录中讨论私人向导、酒店安排和云南行程 PDF",
    title: "Itinerary and hotel planning",
    detail: "Guest communication · trip arrangements",
    copy: "A planning exchange about the guest's guide request, hotel choices and written itinerary.",
  },
  {
    src: "/assets/planning/signed-yunnan-travel-contract.webp",
    alt: "Redacted signed Yunnan travel contract showing the travel agency seal and traveler registration page",
    altZh: "已遮盖旅客信息的云南旅游合同截图，显示旅行社印章和旅游报名表",
    title: "Signed travel contract",
    detail: "Contract excerpt · guest details obscured",
    copy: "A real travel contract excerpt showing the agency seal and traveler registration page, with guest details obscured.",
  },
];
const records: Record<Category, Evidence[]> = {
  travelers, vehicles: vehiclePhotos, hotels: hotelPhotos, planning: planningDocuments,
};

const notes: Record<Category, string> = {
  travelers: "Guest photos are shown independently of the written reviews; a photo does not identify any reviewer.",
  vehicles: "These photos show one seven-seat MPV example. Your actual vehicle is selected for your group and luggage, then confirmed in your written proposal.",
  hotels: "These are existing hotel examples, not guaranteed properties. Your quotation names the hotels, room types and included breakfasts.",
  planning: "These are real planning conversations and a contract excerpt. Guest names and identifying details are obscured in the supplied screenshots.",
};

export function RealJourneyEvidence({ locale = "en" }: { locale?: "en" | "zh" }) {
  const zh = locale === "zh";
  const [active, setActive] = useState<Category>("travelers");
  const [expanded, setExpanded] = useState<Partial<Record<Category, boolean>>>({});
  const [viewing, setViewing] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = active === "vehicles" && zh ? vehiclePhotosZh : records[active];
  const selected = viewing === null ? null : items[viewing];
  const categoryTitle = (id: Category) => zh ? ({ travelers:"旅客旅程", vehicles:"车辆", hotels:"酒店实景", planning:"预订与合同" } as Record<Category,string>)[id] : categories.find(c=>c.id===id)?.label || id;
  const titleFor = (item: Evidence, index: number) => !zh || active === "vehicles" ? item.title : active === "travelers" ? `云南旅行照片 ${index+1}` : active === "hotels" ? `酒店实景 ${index+1}` : ["向旅客分享当地美食推荐","行程与酒店安排沟通","已签署的旅游合同"][index] || "真实预订记录";
  const detailFor = (item: Evidence) => !zh || active === "vehicles" ? item.detail : active === "planning" ? "真实沟通与合同资料" : "实际服务资料照片";
  const copyFor = (item: Evidence, index: number) => !zh || active === "vehicles" ? item.copy : active === "travelers" ? "现有旅行资料中的旅客照片，未公开身份及具体行程信息。" : active === "hotels" ? "当地合作酒店参考照片。具体酒店、房型及早餐安排以正式报价为准。" : ["Joy 在真实沟通中向旅客分享昆明与大理的当地美食推荐。","真实沟通记录，涉及向导要求、酒店选择和书面行程。","真实旅游合同片段，展示旅行社印章及旅游报名表，旅客身份信息已遮盖。"][index] || "真实预订记录。";
  const noteFor = (id: Category) => !zh ? notes[id] : ({ travelers:"照片来自已有旅行资料，不代表照片人物提供了公开评价。", vehicles:"照片展示一辆七座商务车作为参考，实际车辆按人数和行李需求确定，并写入书面方案。", hotels:"这里展示的是酒店参考照片，实际酒店名称、房型和早餐安排会在书面报价中列明。", planning:"展示真实的行程沟通和合同片段；所提供截图中的旅客姓名及识别信息已遮盖。" } as Record<Category,string>)[id];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && !dialog?.open) dialog?.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  function close() { setViewing(null); }
  function changeCategory(category: Category) {
    close();
    setActive(category);
  }
  function move(direction: -1 | 1) {
    setViewing(index => index === null ? null : (index + direction + items.length) % items.length);
  }
  return <section className="journey-proof section section-sand real-journey-evidence" id="real-arrangements" aria-labelledby="real-evidence-title">
    <div className="shell">
      <div className="journey-editorial-heading real-evidence-heading">
        <span>{zh ? "真实云南旅行服务" : "BEHIND YOUR YUNNAN JOURNEY"}</span>
        <h2 id="real-evidence-title">{zh ? "真实旅程，真实安排" : "Real Journeys, Real Arrangements"}</h2>
        <p>{zh ? "看看云南私人旅行的车辆、酒店、行程沟通及合同资料。" : "See the vehicles, hotels, planning conversations and contract details behind our private Yunnan journeys."}</p>
      </div>
      <div className="proof-group-switch journey-proof-tabs real-evidence-tabs" role="tablist" aria-label={zh ? "真实旅行资料分类" : "Real journey evidence categories"}>
        {categories.map(category => <button key={category.id} type="button"
          role="tab" id={`evidence-tab-${category.id}`}
          aria-controls="real-evidence-panel"
          aria-selected={active === category.id}
          tabIndex={active === category.id ? 0 : -1}
          onClick={() => changeCategory(category.id)}>{categoryTitle(category.id)}</button>)}
      </div>
      <div id="real-evidence-panel" role="tabpanel" aria-labelledby={`evidence-tab-${active}`}>
        {items.length ? <>
          <div className={`real-evidence-grid real-evidence-grid-${active}`}>
            {items.slice(0, expanded[active] ? items.length : 4).map((item, i) =>
              <button className="real-evidence-item" key={item.src} type="button" onClick={() => setViewing(i)} aria-label={zh ? `查看图片：${titleFor(item, i)}` : `View photo: ${item.title}`}>
                <span className="real-evidence-image"><Image src={encodeURI(item.src)} alt={zh ? item.altZh || item.alt : item.alt} fill
                  sizes="(max-width: 700px) 46vw, (max-width: 1100px) 44vw, 25vw" /></span>
                <span className="real-evidence-caption"><small>{detailFor(item)}</small><strong>{titleFor(item, i)}</strong></span>
              </button>)}
          </div>
          {items.length > 4 ? <div className="real-evidence-more"><button type="button" className="button button-light" onClick={() => setExpanded(value => ({...value, [active]: !value[active]}))}>{expanded[active] ? (zh ? "收起" : "Show fewer") : (zh ? `查看更多（${items.length-4}）` : `View more (${items.length - 4})`)}</button></div> : null}
        </> : <div className="real-evidence-pending"><h3>{zh ? "更多真实预订资料审核中" : "Real planning records, coming after review"}</h3><p>{noteFor("planning")}</p></div>}
        <p className="real-evidence-note">{noteFor(active)}</p>
      </div>
    </div>
    <div className="journey-final-cta real-evidence-cta">
      <div className="shell">
        <h2>{zh ? "想看看你的专属云南行程可以怎么安排？" : "Want to see what your own Yunnan journey could look like?"}</h2>
        <span>{zh ? "告诉 Joy 你的出行人数和兴趣，我们会提供适合你的私人路线与初步报价。" : "Tell Joy a little about your group and interests to receive a suggested private route and price range."}</span>
        <a className="button button-light" href="#plan" data-cta-location="preview_evidence_cta">{zh ? "获取定制路线与报价" : "Get My Route & Price"}</a>
      </div>
    </div>

    <dialog ref={dialogRef} className="real-evidence-dialog" onClose={close} onCancel={close} aria-label={selected ? titleFor(selected, viewing ?? 0) : (zh ? "旅程照片" : "Journey photo")}>
      {selected ? <div className="real-evidence-modal">
        <div className="real-evidence-modal-head"><span>{categoryTitle(active)}</span><button type="button" className="real-evidence-close" onClick={close} aria-label={zh ? "关闭图片" : "Close image"}>×</button></div>
        <div className="real-evidence-modal-image"><Image src={encodeURI(selected.src)} alt={zh ? selected.altZh || selected.alt : selected.alt} fill sizes="(max-width: 800px) 90vw, 900px" /></div>
        <div className="real-evidence-modal-info"><div><small>{detailFor(selected)}</small><h3>{titleFor(selected, viewing ?? 0)}</h3><p>{copyFor(selected, viewing ?? 0)}</p></div><div className="proof-carousel-controls"><span>{String(viewing!+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span><div><button type="button" aria-label={zh ? "上一张图片" : "Previous image"} onClick={() => move(-1)}>←</button><button type="button" aria-label={zh ? "下一张图片" : "Next image"} onClick={() => move(1)}>→</button></div></div></div>
      </div> : null}
    </dialog>
  </section>;
}
