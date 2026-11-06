import { Link } from "@/i18n/navigation";

type Props = {
  /** Current locale of the page the link is rendered on. */
  lang: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  "data-cta-location"?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/**
 * Link to a path that must never receive the locale prefix.
 *
 * Two cases need this:
 * 1. `/go/*` affiliate redirects live outside the `[lang]` segment, so
 *    `/zh/go/...` would 404 — on every locale they have to stay unprefixed.
 * 2. English-only pages (legal pages, per-country visa guides) have no
 *    `/zh` route, so a Chinese page must point at the English URL.
 *
 * On the English site the regular i18n `Link` is used so client-side
 * navigation and prefetching keep working.
 */
export function UnprefixedLink({
  lang,
  href,
  children,
  className,
  ...rest
}: Props) {
  if (lang === "zh") {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
