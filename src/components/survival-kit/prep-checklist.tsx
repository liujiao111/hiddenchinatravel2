"use client";

import { useSyncExternalStore } from "react";

const items = [
  "Entry rules checked for my passport and route",
  "First nights and key transport booked",
  "Mobile data ready and VPN tested if needed",
  "Alipay set up with a backup payment method",
  "Amap installed and first hotel saved",
  "Passport details match every booking",
  "Insurance, emergency contacts and booking copies saved offline",
];

const storageKey = "hct-china-prep-checklist-v1";

export function PrepChecklist() {
  const saved = useSyncExternalStore(
    (notify) => { window.addEventListener("storage", notify); window.addEventListener("hct-checklist-change", notify); return () => { window.removeEventListener("storage", notify); window.removeEventListener("hct-checklist-change", notify); }; },
    () => localStorage.getItem(storageKey) || "[]",
    () => "[]",
  );
  let done: number[] = [];
  try { const parsed: unknown = JSON.parse(saved); if (Array.isArray(parsed)) done = parsed.filter((value): value is number => typeof value === "number" && value >= 0 && value < items.length); } catch { /* Invalid storage starts empty. */ }

  function toggle(index: number) {
    const next = done.includes(index) ? done.filter((value) => value !== index) : [...done, index];
    try { localStorage.setItem(storageKey, JSON.stringify(next)); window.dispatchEvent(new Event("hct-checklist-change")); } catch { /* Continue without persistence. */ }
  }

  return <div className="kit-checklist">
    <p className="kit-progress" aria-live="polite">{done.length} of {items.length} ready</p>
    <div className="kit-check-grid">{items.map((label, index) => <label key={label} className={done.includes(index) ? "is-done" : ""}>
      <input type="checkbox" checked={done.includes(index)} onChange={() => toggle(index)} />
      <span>{label}</span>
    </label>)}</div>
    <p className="kit-save-note">Your ticks are saved in this browser. Save copies of important documents somewhere you can reach offline.</p>
  </div>;
}
