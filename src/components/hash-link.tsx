"use client";

import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  "data-cta-location"?: string;
};

export function HashLink({ href, className, children, ...rest }: Props) {
  function go(event: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "auto", block: "start" });
    if (window.location.hash !== href) window.history.replaceState(null, "", href);
    target.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }

  return <a href={href} className={className} onClick={go} {...rest}>{children}</a>;
}
