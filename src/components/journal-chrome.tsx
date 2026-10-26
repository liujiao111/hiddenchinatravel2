"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  url: string;
};

export function JournalChrome({ title, url }: Props) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const article = document.getElementById("journal-article");
    if (!article) return;

    const read = () => {
      const start = article.offsetTop;
      const end = start + article.offsetHeight - window.innerHeight;
      const next = end <= start ? 1 : (window.scrollY - start) / (end - start);
      setProgress(Math.min(1, Math.max(0, next)));
    };

    const onScroll = () => {
      read();
      setDocked(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shareText = `${title} ${url}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return <>
    <div className="journal-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
    <div className={`journal-share${docked ? " is-docked" : ""}`}>
      <button type="button" onClick={copyLink} aria-label={copied ? "Link copied" : "Copy link to this journal"}>{copied ? "Copied" : "Copy"}</button>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer">Share</a>
    </div>
  </>;
}
