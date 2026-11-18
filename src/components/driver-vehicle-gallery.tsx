"use client";

import Image from "next/image";
import { useState } from "react";

const photos = {
  five: [
    ["five-seat-hongqi", "Five-seat car exterior (Hongqi)", "5座车外观（红旗）"],
    ["five-seat-toyota", "Five-seat car exterior (Toyota)", "5座车外观（丰田）"],
    ["five-seat-aion", "Five-seat car exterior (Aion)", "5座车外观（埃安）"],
  ],
  seven: [
    ["seven-seat-mpv-exterior-three-quarter", "Seven-seat MPV exterior", "7座商务车外观"],
    ["seven-seat-mpv-front-seats", "Seven-seat MPV front seats", "7座商务车前排"],
    ["seven-seat-mpv-captain-seats", "Seven-seat MPV second row", "7座商务车第二排"],
  ],
} as const;

export function DriverVehicleGallery({ zh }: { zh: boolean }) {
  const [vehicle, setVehicle] = useState<keyof typeof photos>("five");
  const [index, setIndex] = useState(0);
  const slides = photos[vehicle];
  const [file, enAlt, zhAlt] = slides[index];
  const T = (en: string, cn: string) => zh ? cn : en;
  const label = (key: keyof typeof photos) => key === "five"
    ? T("5-seat private car", "5座私人汽车")
    : T("7-seat MPV", "7座商务车");

  return <>
    <div className="driver-vehicle-switch" role="group" aria-label={T("Vehicle category", "车型")}>
      {(Object.keys(photos) as (keyof typeof photos)[]).map(key => (
        <button key={key} type="button" aria-pressed={vehicle === key} onClick={() => {
          if (key !== vehicle) {
            setVehicle(key);
            setIndex(0);
          }
        }}>{label(key)}</button>
      ))}
    </div>
    <div className="driver-vehicle-grid">
      <figure className="driver-vehicle-gallery">
        <div className="driver-vehicle-photo">
          <Image src={`/assets/partners/vehicles/${file}.webp`} alt={T(enAlt, zhAlt)} fill sizes="(max-width:900px) 100vw, 50vw" />
        </div>
        <div className="driver-vehicle-controls">
          <button type="button" aria-label={T("Previous photo", "上一张照片")} onClick={() => setIndex(i => (i + slides.length - 1) % slides.length)}>←</button>
          <span aria-live="polite">{index + 1} / {slides.length} · {T(enAlt, zhAlt)}</span>
          <button type="button" aria-label={T("Next photo", "下一张照片")} onClick={() => setIndex(i => (i + 1) % slides.length)}>→</button>
        </div>
      </figure>
      <div className="driver-vehicle-copy">
        <h3>{label(vehicle)}</h3>
        <dl>
          <div><dt>{T("Travellers", "乘客人数")}</dt><dd>{vehicle === "five" ? T("Recommended for 1–3", "建议1–3人") : T("Up to 6 travellers", "最多6位旅客")}</dd></div>
          <div><dt>{T("Luggage guide", "行李参考")}</dt><dd>{vehicle === "five" ? T("Up to 3 large cases · dimensions checked", "最多3个大箱 · 需核实尺寸") : T("Space confirmed based on your luggage", "根据实际行李确认空间")}</dd></div>
        </dl>
        <p>{T("Photos show examples from local partners. The assigned vehicle may vary. We check luggage space before confirming.", "图片为当地合作方的实车示例，实际派车可能不同。确认前我们会核实行李空间。")}</p>
        <a href="#driver-quote-form" className="driver-text-link">{T("Need a larger vehicle? Request a quote", "需要更大车型？提交需求")}</a>
      </div>
    </div>
  </>;
}
