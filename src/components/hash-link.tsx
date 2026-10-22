"use client";

import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  id?: string;
  className?: string;
  children: ReactNode;
  onJump?: () => void;
  "data-cta-location"?: string;
};

export function HashLink({ href, className, children, onJump, ...rest }: Props) {
  function go(event: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    const offset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    html.style.scrollBehavior = previous;
    if (window.location.hash !== href) window.history.replaceState(null, "", href);
    onJump?.();
    target.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }

  return <a href={href} className={className} onClick={go} {...rest}>{children}</a>;
}
