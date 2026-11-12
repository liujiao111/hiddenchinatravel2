"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Reuse the existing global WhatsApp click listener for Lead ID and attribution.
// An outbound redirect is a click-intent signal, NOT a confirmed message.
export function WhatsAppRedirect({ locale }: { locale: "en" | "zh" }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const openedRef = useRef(false);
  const href = buildWhatsAppUrl(undefined, locale);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (openedRef.current || !linkRef.current || document.visibilityState === "hidden") return;
      openedRef.current = true;
      // Same-tab navigation avoids popup blockers. The delegated site-wide
      // listener injects Ref and emits the existing whatsapp_click event.
      linkRef.current.click();
    }, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const zh = locale === "zh";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-soft)] px-5 py-12">
      <div className="w-full max-w-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center sm:px-12">
        <Image
          src="/brand/founder/portrait.webp"
          alt={zh ? "Hidden China Travel 创始人 Joy" : "Joy, founder of Hidden China Travel"}
          width={112}
          height={112}
          className="mx-auto mb-6 h-28 w-28 rounded-full object-cover"
          priority
        />
        <p className="kicker">{zh ? "HIDDEN CHINA TRAVEL · 云南私人定制" : "HIDDEN CHINA TRAVEL · PRIVATE YUNNAN TOURS"}</p>
        <h1 className="mb-4 text-3xl sm:text-4xl">{zh ? "正在为你打开 WhatsApp…" : "Connecting you to Joy on WhatsApp..."}</h1>
        <p className="mb-7 text-[var(--color-muted)]">
          {zh ? "即将跳转到 WhatsApp。若未自动打开，请点击下方按钮。" : "You’ll be redirected shortly. If WhatsApp doesn’t open, use the button below."}
        </p>
        <a
          ref={linkRef}
          href={href}
          className="button button-primary w-full"
          data-cta-location="whatsapp_redirect_page"
          onClick={() => { openedRef.current = true; }}
        >
          {zh ? "立即打开 WhatsApp" : "Open WhatsApp Now"}
        </a>
        <p className="mt-5 text-sm text-[var(--color-muted)]">
          {zh ? "打开 WhatsApp 不代表消息已发送，确认发送后 Joy 才能收到。" : "Opening WhatsApp does not send a message. Please press Send to contact Joy."}
        </p>
      </div>
    </main>
  );
}
