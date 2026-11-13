"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
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
  const locale = useLocale() === "zh" ? "zh" : "en";
  const zh = locale === "zh";
  const [barOffset, setBarOffset] = useState(0);
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
      const bars = Array.from(document.querySelectorAll<HTMLElement>(".mobile-cta-bar, .journey-mobile-cta, .article-mobile-ask"));
      const offset = bars.reduce((height, bar) => {
        const r = bar.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < innerHeight ? Math.max(height, innerHeight - Math.max(0, r.top) + 16) : height;
      }, 0);
      setBarOffset(offset);
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
    mutation.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "aria-modal", "class"] });
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
    try { await navigator.clipboard.writeText(WECHAT_ID); setCopyStatus(zh ? "已复制微信号" : "WeChat ID copied"); record("wechat_id_copy", "wechat"); }
    catch { setCopyStatus(zh ? "无法自动复制，请长按微信号手动复制。" : "Please press and hold the WeChat ID to copy it."); }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(""), 4000);
  }
  function changeChannel(next: Channel, focus = false) {
    setChannel(next); setCopyStatus("");
    if (focus) panelRef.current?.querySelector<HTMLButtonElement>(`#contact-tab-${next}`)?.focus();
  }

  return <div ref={rootRef} className={styles.root} data-contact-widget="global" style={barOffset && !open ? { bottom: barOffset } : undefined} data-open={open || undefined}>
    {open && <button className={styles.scrim} onClick={close} aria-label={zh ? "关闭咨询面板遮罩" : "Close contact panel"} tabIndex={-1} />}
    {open && <section ref={panelRef} className={styles.panel} role="dialog" aria-label={zh ? "咨询云南私人定制旅行" : "Plan a private Yunnan trip"}>
      <div className={styles.grip} aria-hidden="true" />
      <header className={styles.head}>
        <span className={styles.kicker}>HIDDEN CHINA TRAVEL</span>
        <button type="button" className={styles.close} onClick={close} aria-label={zh ? "关闭咨询面板" : "Close contact panel"}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>
        <h2>{zh ? "规划你的云南之旅" : "Plan your Yunnan trip"}</h2>
        <p>{zh ? "联系 Joy，获取私人行程建议与报价。" : "Contact Joy for a private itinerary and quote."}</p>
      </header>
      <div className={styles.advisor}>
        <span className={styles.advisorPortrait}><Image src="/brand/founder/avatar-joy.webp" alt="Joy Liu" width={56} height={64} unoptimized /></span>
        <div><strong>Joy Liu</strong><span>{zh ? "创始人 · 云南本地旅行规划" : "Founder · Yunnan travel specialist"}</span></div>
        <span className={styles.advisorLanguages}>中文 / English</span>
      </div>
      <div className={styles.tabs} role="tablist" aria-label={zh ? "选择联系方式" : "Choose a contact method"}>
        {(["whatsapp", "wechat"] as const).map(item => <button type="button" key={item} id={`contact-tab-${item}`} role="tab" aria-selected={channel === item} aria-controls={`contact-qr-${item}`} tabIndex={channel === item ? 0 : -1} onClick={() => changeChannel(item)} onKeyDown={e => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); changeChannel(e.key === "Home" ? "whatsapp" : e.key === "End" ? "wechat" : item === "whatsapp" ? "wechat" : "whatsapp", true); } }}>
          {item === "whatsapp" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-4.8A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8 7.5c0 4 4 8 8 8l1-2.2-3-1-1 1c-1.5-.5-3-2-3.5-3.5l1-1-1-2.5Z"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M13.5 15a7.7 7.7 0 0 1-5 .1L5 17l.8-3A5.5 5.5 0 0 1 3 9.3C3 6.4 6 4 9.7 4s6.8 2.4 6.8 5.3"/><path d="M21 14c0 2.3-2.4 4.2-5.4 4.2-.7 0-1.4-.1-2-.3L11 19l.6-2.2a3.8 3.8 0 0 1-1.4-2.8c0-2.4 2.4-4.3 5.4-4.3S21 11.6 21 14Z"/></svg>}
          {item === "whatsapp" ? "WhatsApp" : zh ? "微信" : "WeChat"}
        </button>)}
      </div>
      {(["whatsapp", "wechat"] as const).map(item => <div key={item} id={`contact-qr-${item}`} role="tabpanel" aria-labelledby={`contact-tab-${item}`} className={styles.content} hidden={channel !== item}>
        <div className={styles.channelLayout}>
          <div className={`${styles.qr} ${item === "whatsapp" ? styles.whatsappQr : styles.wechatQr}`}>
            <Image src={`/assets/contact/joy-${item}-qr.jpeg`} alt={item === "whatsapp" ? (zh ? "扫码与 Joy 在 WhatsApp 聊天" : "Scan to chat with Joy on WhatsApp") : (zh ? "扫码添加 Joy 的微信" : "Scan to add Joy on WeChat")} width={item === "whatsapp" ? 1320 : 888} height={item === "whatsapp" ? 2868 : 1137} unoptimized />
          </div>
          <div className={styles.channelNotes}>
            <strong>{item === "whatsapp" ? (zh ? "扫码联系 Joy" : "Scan to contact Joy") : (zh ? "添加 Joy 的微信" : "Add Joy on WeChat")}</strong>
            {item === "whatsapp" ? <><p className={styles.desktopHelp}>{zh ? <>用手机相机扫一扫，<br/>在 WhatsApp 上沟通。</> : "Scan with your phone camera to chat on WhatsApp."}</p><p className={styles.mobileHelp}>{zh ? <>用手机浏览？<br/>点击下方直接聊天。</> : "On your phone? Tap below to start chatting."}</p></> : <><p className={styles.desktopHelp}>{zh ? <>打开微信扫一扫，<br/>发送好友申请。</> : "Scan in WeChat and send a friend request."}</p><p className={styles.mobileHelp}>{zh ? <>保存二维码后，<br/>在微信相册中识别。</> : "Save the QR code, then open it in the WeChat scanner."}</p></>}
            <a className={styles.save} href={`/assets/contact/joy-${item}-qr.jpeg`} download={`Joy-${item}-QR.jpeg`} onClick={() => record("contact_qr_download", item)}>{zh ? "保存二维码" : "Save QR code"} <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        {item === "whatsapp" ? <a className={`button button-primary ${styles.direct}`} href={buildWhatsAppUrl(undefined, locale)} target="_blank" rel="noopener noreferrer" data-cta-location="floating_whatsapp">{zh ? "打开 WhatsApp 聊天" : "Chat on WhatsApp"} <span aria-hidden="true">↗</span></a> : <>
          <div className={styles.idRow}><div><small>{zh ? "微信号" : "WeChat ID"}</small><strong>{WECHAT_ID}</strong></div><button type="button" className={`button button-text ${styles.copy}`} onClick={copyWechat}>{copyStatus === (zh ? "已复制微信号" : "WeChat ID copied") ? (zh ? "已复制 ✓" : "Copied ✓") : (zh ? "复制微信号" : "Copy WeChat ID")}</button></div>
          <div className={styles.status} role="status">{copyStatus}</div>
        </>}
      </div>)}
      <footer className={styles.footer}><p>{zh ? "免费初步咨询，无需立即预订。" : "A free initial conversation, with no obligation to book."}</p><span>{zh ? "大理 · 沙溪 · 丽江 · 香格里拉 · 泸沽湖" : "Dali · Shaxi · Lijiang · Shangri-La · Lugu Lake"}</span></footer>
    </section>}
    {!open && nudge && !suppressed && <div className={styles.nudge}><button type="button" aria-label={zh ? "关闭提示" : "Dismiss tip"} onClick={() => setNudge(false)}>×</button>{zh ? <>正在计划云南旅行？<br/>联系 Joy，获取行程建议与报价。</> : <>Planning a trip to Yunnan?<br/>Ask Joy about your itinerary and quote.</>}</div>}
    <div ref={actionRef} className={styles.action} style={!open && suppressed ? { visibility: "hidden", pointerEvents: "none" } : undefined}>
      {!open && <span className={styles.badge} aria-hidden="true">{zh ? "联系 Joy" : "Contact Joy"}<small>{zh ? "WhatsApp · 微信" : "WhatsApp · WeChat"}</small></span>}
      <button type="button" className={styles.launch} aria-label={open ? (zh ? "收起联系方式" : "Close contact options") : (zh ? "联系 Joy：WhatsApp 或微信" : "Contact Joy: WhatsApp or WeChat")} aria-expanded={open} onClick={() => open ? close() : show()}><ChatIcon /></button>
    </div>
    {backToTop && !open && <button className="wa-back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} aria-label={zh ? "返回顶部" : "Back to top"}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>}
  </div>;
}
