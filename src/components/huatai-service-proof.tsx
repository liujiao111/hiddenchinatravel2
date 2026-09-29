import Image from "next/image";
import { ProofCarousel, type ProofSlide } from "@/components/proof-carousel";
const root="/assets/partners/huatai";
const guides:ProofSlide[]=[
  {src:`${root}/guides/zhang-zihang.webp`,alt:"Portrait of Zhang Zihang",title:"Zhang Zihang (Jason)",detail:"English-speaking guide · English guide qualification",copy:"A profile from the partner guide team. Final assignment depends on your dates."},
  {src:`${root}/guides/kuang-jintao.webp`,alt:"Portrait of Kuang Jintao",title:"Kuang Jintao (Taozi)",detail:"Chinese-speaking guide · 8 years of experience",copy:"Experienced with private and custom journeys."},
  {src:`${root}/guides/huang-qun.webp`,alt:"Portrait of Huang Qun",title:"Huang Qun (Daxiang)",detail:"Chinese-speaking guide · 7 years of experience",copy:"Experienced with private and educational journeys."},
];
const drivers:ProofSlide[]=[
  {src:`${root}/drivers/xu-yunwei.webp`,alt:"Xu Yunwei from the partner driver team",title:"Xu Yunwei",detail:"Partner driver · five-seat vehicle"},
  {src:`${root}/drivers/dong-hao.webp`,alt:"Dong Hao from the partner driver team",title:"Dong Hao",detail:"Partner driver · seven-seat vehicle"},
  {src:`${root}/drivers/tong-xue.webp`,alt:"Tong Xue from the partner driver team",title:"Tong Xue",detail:"Partner driver · seven-seat vehicle"},
];
const vehicles:ProofSlide[]=[
  {src:`${root}/vehicles/five-seat-exterior.webp`,alt:"Five-seat partner vehicle exterior",title:"Five-seat vehicle",detail:"Exterior · partner fleet example"},
  {src:`${root}/vehicles/seven-seat-exterior.webp`,alt:"Seven-seat partner vehicle front exterior",title:"Seven-seat vehicle",detail:"Exterior · partner fleet example"},
  {src:`${root}/vehicles/seven-seat-side.webp`,alt:"Seven-seat partner vehicle side exterior",title:"Seven-seat vehicle",detail:"Side view · partner fleet example"},
  {src:`${root}/vehicles/seven-seat-cabin.webp`,alt:"Passenger cabin in a partner vehicle",title:"Passenger cabin",detail:"Interior · partner fleet example"},
  {src:`${root}/vehicles/seven-seat-second-row.webp`,alt:"Second-row seating in a partner vehicle",title:"Second-row seating",detail:"Interior · partner fleet example"},
  {src:`${root}/vehicles/denza-d9-seats.webp`,alt:"Denza D9 seating in a partner vehicle",title:"Denza D9 seating",detail:"Interior · another partner fleet example"},
];
export function HuataiServiceProof(){return <section className="journey-proof section section-sand" id="local-team" aria-labelledby="local-team-title"><div className="shell">
  <div className="journey-editorial-heading"><span>THE PEOPLE BEHIND YOUR JOURNEY</span><h2 id="local-team-title">Meet the local team and see the real vehicles.</h2><p>Joy shapes the plan with you. Yunnan Huatai International Travel Service Co., Ltd. is the proposed local operator. These are real profiles and vehicles from its supplied materials; the final team and vehicle are confirmed in writing.</p></div>
  <div className="journey-proof-grid"><div className="journey-proof-copy"><span>01 / YOUR GUIDE</span><h3>A person who knows the route</h3><p>A guide is included throughout all six days. Choose Chinese or English; discuss another language with Joy in advance. These are three guides in the partner team, including an English-speaking guide.</p></div><ProofCarousel label="Local guide profiles" slides={guides} variant="portrait"/></div>
  <div className="journey-proof-grid"><div className="journey-proof-copy"><span>02 / YOUR DRIVER</span><h3>Real people behind the wheel</h3><p>Meet three drivers in the partner materials. The specific driver depends on your dates and is confirmed before departure.</p></div><ProofCarousel label="Partner driver profiles" slides={drivers} variant="portrait"/></div>
  <div className="journey-proof-grid"><div className="journey-proof-copy"><span>03 / YOUR VEHICLE</span><h3>See outside and inside</h3><p>Browse the exterior and seating of vehicles in the partner materials. The final model and seating capacity are selected for your group and written into the proposal.</p></div><ProofCarousel label="Partner vehicle exteriors and interiors" slides={vehicles} variant="landscape"/></div>
  <div className="journey-proof-license"><div><span>THE LOCAL OPERATOR</span><h3>Company documents you can inspect</h3><p>Yunnan Huatai International Travel Service Co., Ltd. supplied its business license and travel agency permit (L-YN-101161). Open either image to read the full document. Your proposal identifies the contracting operator and exact services.</p></div><div className="journey-proof-documents"><a href={`${root}/credentials/business-license.jpg`} target="_blank" rel="noopener noreferrer"><Image src={`${root}/credentials/business-license.jpg`} alt="Business license supplied by Yunnan Huatai International Travel Service" width={1536} height={1067} unoptimized/><span>View business license ↗</span></a><a href={`${root}/credentials/travel-agency-permit.jpg`} target="_blank" rel="noopener noreferrer"><Image src={`${root}/credentials/travel-agency-permit.jpg`} alt="Travel agency permit supplied by Yunnan Huatai International Travel Service" width={3120} height={2293} unoptimized/><span>View travel agency permit ↗</span></a></div></div>
</div></section>}
