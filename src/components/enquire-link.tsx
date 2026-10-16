"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { contactHref } from "@/lib/enquiry";

const retryDelays = [0, 50, 120, 250, 500, 900];

export function scrollToEnquire() {
  if (typeof window === "undefined" || window.location.hash !== "#enquire") return false;
  const form = document.getElementById("enquire");
  if (!form) return false;
  form.scrollIntoView({ behavior: "auto", block: "start" });
  return Math.abs(form.getBoundingClientRect().top) < 48;
}

export function scheduleScrollToEnquire() {
  retryDelays.forEach((delay) => window.setTimeout(scrollToEnquire, delay));
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  interest?: string;
};

export function EnquireLink({ interest, onClick, ...props }: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    scheduleScrollToEnquire();
  }

  return <Link {...props} href={contactHref(interest)} scroll={false} onClick={handleClick} />;
}
