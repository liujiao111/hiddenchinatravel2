"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isZhLive } from "@/lib/i18n-seo";

type LocaleLinkProps = ComponentProps<typeof Link>;

/**
 * Keeps Chinese visitors on translated pages. Links to content that has not
 * been localized deliberately open the original English URL, without adding
 * a /zh 404 or an unnecessary /en redirect.
 */
export function LocaleLink(props: LocaleLinkProps) {
  const currentLocale = useLocale();
  let fallbackToEnglish = false;

  if (currentLocale === "zh" && !props.locale && typeof props.href === "string" && props.href.startsWith("/") && !props.href.startsWith("//")) {
    const path = props.href.split(/[?#]/)[0] || "/";
    fallbackToEnglish = path !== "/search" && !isZhLive(path);
  }

  if (fallbackToEnglish) {
    const linkProps = { ...props };
    delete linkProps.locale;
    return <NextLink {...linkProps} />;
  }

  return <Link {...props} />;
}
