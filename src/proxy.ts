import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next.js 16 request-interception file (formerly `middleware.ts`).
 * Rewrites prefix-less English URLs to the internal `en` locale and serves
 * Chinese URLs under /zh. Runs after next.config redirects, so all legacy
 * WordPress redirects keep working untouched.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, affiliate redirect routes (/go/*), Next internals and
  // any file with an extension (images, fonts, sitemap.xml, robots.txt ...).
  matcher: ["/((?!api|go|_next|_vercel|.*\\..*).*)"],
};
