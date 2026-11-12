"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { analyticsDenied, getAttribution } from "@/lib/attribution";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./yunnan-contact-widget.module.css";

type Channel = "whatsapp" | "wechat";
const WECHAT_ID = "ll917961898";
const NOTICE_KEY = "hct_whatsapp_nudge_seen_v1";

function record(event: string, channel?: Channel) {
  if (analyticsDenied()) return;
  const attribution = getAttribution();
  trackEvent(event, {
    channel, page_path: window.location.pathname, conversion_page: window.location.pathname,
    cta_location: "floating_contact", first_source: attribution.first.source,
    first_medium: attribution.first.medium, last_source: attribution.last.source,
    last_medium: attribution.last.medium,
  });
}

function ChatIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M15 13.5H8l-4 3V13a3 3 0 0 1-2-2.8V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4.5a3 3 0 0 1-3 3Z"/><path d="M8 17v.5a2.5 2.5 0 0 0 2.5 2.5H17l4 2v-3a2.5 2.5 0 0 0 1-2v-5.5a2.5 2.5 0 0 0-1-2"/></svg>;
}

export function YunnanContactWidget() {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [suppressed, setSuppressed] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const viewedChannels = useRef(new Set<Channel>());
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function close() { setOpen(false); }
  function show() {
    lastFocus.current = document.activeElement as HTMLElement;
    setChannel("whatsapp"); setOpen(true); setNudge(false);
    try { sessionStorage.setItem(NOTICE_KEY, "1"); } catch { /* optional storage */ }
    record("contact_panel_open");
  }

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      setBackToTop(window.scrollY > 360);
      const rect = actionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const externalDialog = Array.from(document.querySelectorAll("dialog[open], [role='dialog'][aria-modal='true']"))
        .some(el => !rootRef.current?.contains(el));
      const overlap = Array.from(document.querySelectorAll("form.contact-form, form.preview-enquiry, form.custom-journey-form, #plan form")).some(form => {
        const f = form.getBoundingClientRect();
        return f.width > 0 && f.height > 0 && f.left < rect.right + 8 && f.right > rect.left - 8 && f.top < rect.bottom + 8 && f.bottom > rect.top - 8;
      });
      setSuppressed(externalDialog || overlap);
      if (externalDialog) setOpen(false);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
    const resize = new ResizeObserver(schedule); resize.observe(document.body);
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "aria-modal"] });
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule); sync();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); window.visualViewport?.removeEventListener("resize", schedule); };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!viewedChannels.current.has(channel)) { viewedChannels.current.add(channel); record("contact_qr_view", channel); }
  }, [open, channel]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const oldOverflow = document.body.style.overflow;
    const mobile = window.matchMedia("(max-width: 700px)");
    const sync = () => { document.body.style.overflow = mobile.matches ? "hidden" : oldOverflow; panel?.setAttribute("aria-modal", String(mobile.matches)); };
    sync(); mobile.addEventListener("change", sync);
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']")).filter(el => el.tabIndex >= 0 && el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    const outside = (e: MouseEvent) => { if (e.target instanceof Node && !rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("keydown", key); document.addEventListener("click", outside);
    return () => {
      document.body.style.overflow = oldOverflow; mobile.removeEventListener("change", sync);
      document.removeEventListener("keydown", key); document.removeEventListener("click", outside);
      lastFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 701px) and (hover: hover)");
    let ready = false, done = false;
    let dismiss: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      if (!ready || done || !desktop.matches || document.hidden || open || suppressed) return;
      try { if (sessionStorage.getItem(NOTICE_KEY)) return; } catch { /* optional storage */ }
      if (document.querySelector("dialog[open], [role='dialog'][aria-modal='true']")) return;
      if (Array.from(document.querySelectorAll("form.contact-form, form.preview-enquiry, form.custom-journey-form")).some(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })) return;
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total <= 0 || scrollY / total < .4) return;
      done = true; try { sessionStorage.setItem(NOTICE_KEY, "1"); } catch { /* optional storage */ }
      setNudge(true); dismiss = setTimeout(() => setNudge(false), 5000);
    };
    const timer = setTimeout(() => { ready = true; check(); }, 20000);
    window.addEventListener("scroll", check, { passive: true });
    return () => { clearTimeout(timer); if (dismiss) clearTimeout(dismiss); window.removeEventListener("scroll", check); };
  }, [open, suppressed]);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  async function copyWechat() {
    try { await navigator.clipboard.writeText(WECHAT_ID); setCopyStatus("已复制微信号"); record("wechat_id_copy", "wechat"); }
    catch { setCopyStatus("无法自动复制，请长按微信号手动复制。"); }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(""), 4000);
  }
  function changeChannel(next: Channel, focus = false) {
    setChannel(next); setCopyStatus("");
    if (focus) panelRef.current?.querySelector<HTMLButtonElement>(`#contact-tab-${next}`)?.focus();
  }

  return <div ref={rootRef} className={styles.root} data-contact-widget="dali-zh" data-open={open || undefined}>
    {open && <button className={styles.scrim} onClick={close} aria-label="关闭咨询面板遮罩" tabIndex={-1} />}
    {open && <section ref={panelRef} className={styles.panel} role="dialog" aria-label="咨询云南私人定制旅行">
      <div className={styles.grip} aria-hidden="true" />
      <header className={styles.head}>
        <span className={styles.kicker}>HIDDEN CHINA TRAVEL · 云南本地经验</span>
        <button type="button" className={styles.close} onClick={close} aria-label="关闭咨询面板">×</button>
        <h2>咨询云南私人定制旅行</h2>
        <p>大理 · 沙溪 · 丽江 · 香格里拉 · 泸沽湖<br/>选择联系方式，获取行程建议与报价。</p>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="选择联系方式">
        {(["whatsapp", "wechat"] as const).map(item => <button type="button" key={item} id={`contact-tab-${item}`} role="tab" aria-selected={channel === item} aria-controls={`contact-qr-${item}`} tabIndex={channel === item ? 0 : -1} onClick={() => changeChannel(item)} onKeyDown={e => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); changeChannel(e.key === "Home" ? "whatsapp" : e.key === "End" ? "wechat" : item === "whatsapp" ? "wechat" : "whatsapp", true); } }}>{item === "whatsapp" ? "WhatsApp" : "微信"}</button>)}
      </div>
      {(["whatsapp", "wechat"] as const).map(item => <div key={item} id={`contact-qr-${item}`} role="tabpanel" aria-labelledby={`contact-tab-${item}`} className={styles.content} hidden={channel !== item}>
        <div className={`${styles.qr} ${item === "whatsapp" ? styles.whatsappQr : styles.wechatQr}`}>
          <Image src={`/assets/contact/joy-${item}-qr.jpeg`} alt={item === "whatsapp" ? "扫码与 Joy 在 WhatsApp 聊天" : "扫码添加 Joy 的微信"} width={item === "whatsapp" ? 1320 : 888} height={item === "whatsapp" ? 2868 : 1137} unoptimized />
        </div>
        {item === "whatsapp" ? <>
          <p className={styles.desktopHelp}>用手机相机扫码，与 Joy 咨询云南行程。</p>
          <p className={styles.mobileHelp}>正在用手机浏览？<br/>点击下方按钮，直接打开 WhatsApp 聊天。</p>
          <a className={`button button-primary ${styles.direct}`} href={buildWhatsAppUrl(undefined, "zh")} target="_blank" rel="noopener noreferrer" data-cta-location="floating_whatsapp">直接打开 WhatsApp 聊天 <span aria-hidden="true">→</span></a>
          <small className={styles.note}>无需先保存号码 · 发送消息后开始沟通</small>
        </> : <>
          <p className={styles.desktopHelp}>打开微信扫一扫，添加 Joy 咨询行程。</p>
          <p className={styles.mobileHelp}>保存二维码 → 微信扫一扫 → 从相册识别<br/>也可以复制微信号，在微信中搜索。</p>
          <div className={styles.idRow}><div><small>微信号</small><strong>{WECHAT_ID}</strong></div><button type="button" className={styles.copy} onClick={copyWechat}>复制微信号</button></div>
          <div className={styles.status} role="status">{copyStatus}</div>
        </>}
        <a className={styles.save} href={`/assets/contact/joy-${item}-qr.jpeg`} download={`Joy-${item}-QR.jpeg`} onClick={() => record("contact_qr_download", item)}>保存二维码</a>
      </div>)}
      <footer className={styles.footer}>✓ 免费初步咨询 · 看过方案与报价，再决定</footer>
    </section>}
    {!open && nudge && !suppressed && <div className={styles.nudge}><button type="button" aria-label="关闭提示" onClick={() => setNudge(false)}>×</button>正在计划云南旅行？<br/>联系 Joy，获取行程建议与报价。</div>}
    <div ref={actionRef} className={styles.action} style={!open && suppressed ? { visibility: "hidden", pointerEvents: "none" } : undefined}>
      {!open && <span className={styles.badge} aria-hidden="true">联系 Joy<small>WhatsApp · 微信</small></span>}
      <button type="button" className={styles.launch} aria-label={open ? "收起联系方式" : "联系 Joy：WhatsApp 或微信"} aria-expanded={open} onClick={() => open ? close() : show()}><ChatIcon /></button>
    </div>
    {backToTop && !open && <button className="wa-back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} aria-label="返回顶部"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>}
  </div>;
}
