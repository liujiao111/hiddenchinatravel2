"use client";

import { GuideCard } from "@/components/guide-card";
import { useState } from "react";

type Guide = { title: string; summary: string; href: string; image: string };
const topics: Record<string, Guide[]> = {
  "First trip": [
    { title: "Planning Your First China Trip", summary: "Apps, payments and the preparation that prevents day-one chaos.", href: "/independent-travel-china", image: "/assets/blog/independent-travel-china/cover.webp" },
    { title: "China Hotels for Foreigners", summary: "Choose suitable stays and prepare for passport registration.", href: "/hotels-in-china-for-foreigners", image: "/assets/blog/hotels-in-china-for-foreigners/cover.webp" },
    { title: "China Visa-Free Guide", summary: "Check visa-free and transit options before booking flights.", href: "/china-visa-free-countries-2026", image: "/assets/blog/china-visa-free-countries-2026/cover.webp" },
    { title: "Dali Travel Guide", summary: "Where to stay, how long to spend and how to slow the route down.", href: "/dali-travel-guide", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp" },
  ],
  Payments: [
    { title: "How to Pay in China", summary: "Alipay, WeChat Pay, foreign cards, cash and a sensible backup.", href: "/digital-survival-china-payment-guide", image: "/assets/blog/digital-survival-china-payment-guide/cover.webp" },
    { title: "Alipay for Foreigners", summary: "Set up Alipay and link an international bank card before arrival.", href: "/alipay-for-foreigners-china", image: "/assets/blog/alipay-for-foreigners-china/cover.webp" },
    { title: "WeChat Pay for Foreigners", summary: "Registration, verification and everyday payment explained.", href: "/wechat-pay-for-foreigners-china", image: "/assets/blog/wechat-pay-for-foreigners-china/cover.webp" },
    { title: "Why Your Payment Fails", summary: "The common reasons a foreign card or QR payment gets rejected.", href: "/why-your-payment-fails-in-china", image: "/assets/blog/why-your-payment-fails-in-china/cover.webp" },
  ],
  Internet: [
    { title: "Internet in China", summary: "What actually works for Google, WhatsApp and everyday browsing.", href: "/digital-survival-china-internet-guide", image: "/assets/blog/digital-survival-china-internet-guide/cover.webp" },
    { title: "Best eSIM for China", summary: "Compare simple data options for a short China trip.", href: "/best-esim-for-china-travel", image: "/assets/blog/best-esim-for-china-travel/cover.webp" },
    { title: "Do You Need a VPN?", summary: "When an eSIM is enough and when a VPN is useful backup.", href: "/do-you-need-vpn-china", image: "/assets/blog/do-you-need-vpn-china/cover.webp" },
    { title: "China SIM Card Guide", summary: "Local SIM, travel eSIM and Chinese phone-number trade-offs.", href: "/china-sim-card-for-foreigners", image: "/assets/blog/china-sim-card-for-foreigners/cover.webp" },
  ],
  "Getting around": [
    { title: "China Transport Guide", summary: "High-speed rail, metro, Didi and passport-based travel.", href: "/digital-survival-china-transport-guide", image: "/assets/blog/digital-survival-china-transport-guide/cover.webp" },
    { title: "Book High-Speed Rail", summary: "Book train tickets with a foreign passport and board confidently.", href: "/book-china-high-speed-rail-foreigners", image: "/assets/blog/book-china-high-speed-rail-foreigners/cover.webp" },
    { title: "How to Use Didi", summary: "Set up ride-hailing, choose the right pickup point and pay.", href: "/how-to-use-didi-china-foreigners", image: "/assets/blog/how-to-use-didi-china-foreigners/cover.webp" },
    { title: "Maps That Work in China", summary: "Replace unreliable Google Maps with practical alternatives.", href: "/google-maps-china-not-working", image: "/assets/blog/google-maps-china-not-working/cover.webp" },
  ],
};

export function GuidesExplorer() {
  const [active, setActive] = useState("First trip");
  return <div className="guides-explorer"><div className="guide-tabs" role="tablist" aria-label="Travel guide topics">{Object.keys(topics).map((topic) => <button key={topic} type="button" role="tab" aria-selected={active === topic} className={active === topic ? "active" : ""} onClick={() => setActive(topic)}>{topic}</button>)}</div><div className="guide-cover-grid">{topics[active].map((guide) => <GuideCard key={guide.title} guide={{ title: guide.title, excerpt: guide.summary, href: guide.href, image: guide.image, imageAlt: guide.title }} />)}</div></div>;
}
