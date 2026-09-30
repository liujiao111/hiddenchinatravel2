# Yunnan departure guides

The Yunnan hub's `#from-abroad` cards and the Travel Guides menu use the shared registry in `src/lib/yunnan-country-guides.ts`. Supported countries are Singapore (SG), the USA (US), Australia (AU), the UK (GB), and Malaysia (MY).

The hub and `/api/yunnan-country-guide` both filter the registry through the existing article publication gate. Malaysia remains a draft. Change its article status to `published` when publication is approved, then rebuild/deploy: its hub card and country recommendation will appear together. No separate navigation edit is required.

The menu starts with Singapore and requests the recommendation only when it is opened. It retains Singapore for unsupported countries, unpublished guides, missing location data, failed requests, or a three-second timeout. “All departure guides” opens the hub so visitors can choose manually; IP location describes the current connection, not nationality or passport eligibility.

## Hosting requirements

- Direct Vercel requests use `x-vercel-ip-country`.
- When Cloudflare proxies the origin, `cf-ray` identifies the proxy path and `cf-ipcountry` supplies the visitor country. Enable Cloudflare IP Geolocation. If the visitor country is missing or unknown, Singapore is used rather than the Vercel location of the proxy.
- Local development and hosts without these country headers use Singapore. No external IP lookup or raw-IP storage is added.
- The recommendation API is dynamic with `Cache-Control: private, no-store`. Keep it out of any custom Cloudflare “cache everything” rule. Hub and article pages remain statically generated.

Official references: [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Vercel proxy geolocation limitations](https://vercel.com/kb/guide/geo-ip-headers-geolocation-vercel-functions), [Cloudflare IP Geolocation](https://developers.cloudflare.com/network/ip-geolocation/).

## Verification

Run `node --test tests/yunnan-country-guides.test.mjs` on Node 22.18+ (native TypeScript stripping), `npm run lint`, and `npm run build`.

On a production server, test `/api/yunnan-country-guide` with each supported country header, unknown countries, and conflicting Cloudflare/Vercel headers. Confirm draft Malaysia returns SG, the hub excludes its draft link, and the draft URL remains 404. After publication, MY should return MY and the hub should include its card.
