import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always import Link / usePathname /
 * useRouter from here (not from next/navigation) so that internal links keep
 * the /zh prefix when the visitor is on the Chinese site, and stay clean
 * (prefix-free) on the English site.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
