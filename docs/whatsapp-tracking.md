# Unified WhatsApp consultation tracking

Implemented 2026-11-05. Scope: every consultation WhatsApp CTA; existing form APIs,
form fields, GA configuration, phone number, routes, CSS and SEO are preserved.

## Audit

- Next.js 16 App Router, React 19, next-intl; a mix of statically rendered and
  server-rendered routes with client navigation. English is unprefixed; Chinese /zh.
- The shared locale layout loads the existing gtag instance once. No GTM or consent
  banner/Consent Mode initialization was present in this checkout. No new tag added.
- AnalyticsTracker previously classified **all** wa.me/whatsapp.com links as
  whatsapp_click, including journal share-to-friends links. This inflated inquiry
  clicks. It has been replaced by a phone-specific consultation matcher.
- Consultation messages were spread across header/footer, floating button, homepage,
  contact, journeys (including mobile CTA), custom tour, stories, articles, guide,
  survival kit, and form success/fallback links.
- Existing forms: ContactForm and QuickAsk -> /api/enquiry -> Resend;
  CustomJourneyForm -> /api/custom-journey -> Resend. Existing generate_lead calls
  follow successful responses. Their submission logic is outside this change.
- Internal navigation/language links do not consistently carry query parameters.
  Attribution is captured on mount and before a click, then persisted independently
  of the URL; no marketing parameters are removed by this implementation.

## Customer template (identical on all pages, including /zh)

```text
Hi Joy, I'd like help planning a private trip to China.

Ref: HCT-20261105-<16 random hex characters>
```

No Source, Campaign, Page, ad IDs or personal form fields are added to the message.
Existing CTA wording, styles, visibility rules, targets and phone stay unchanged.
SSR/no-JS links use the same greeting; references and attribution require JavaScript.
A new reference is generated only on activation, not on rendering or scrolling.
Form success/fallback WhatsApp links use this same template; the already entered
form fields are no longer copied to WhatsApp. Form/email content remains unchanged.
Journal sharing retains its original share text and is **not** an inquiry event.

## Architecture

- `src/lib/whatsapp.ts`: sole template, phone-specific URL matcher, ID generator.
- `src/lib/attribution.ts`: source detection, first/last/session state; first-party
  host cookie with localStorage fallback, sessionStorage entry deduplication.
- `src/lib/whatsapp-tracking.ts`: single delegated capture listener for normal and
  middle clicks, 1.5s per-button debounce, dynamic CTA normalization, cleanup.
- `src/components/whatsapp-tracker.tsx`: layout-level lifecycle independent of GA
  environment configuration; no per-page handlers or duplicate event sends.
- `src/app/api/whatsapp-click/route.ts`: same-origin receiver with 16KB limit,
  length/type checks, server-side source recomputation, plain-text email escaping
  by stripping control/angle characters, warm-instance burst guard, Resend
  idempotency key derived solely from lead_id.

The handler synchronously updates the anchor href and lets its native action open
WhatsApp. The record request uses fetch keepalive without waiting. A failed record
must never delay or block a conversation. A normal click sends only whatsapp_click;
there is no message_sent, qualified_lead or generate_lead event in this flow.

## Attribution

All 11 requested click/UTM keys are allowlisted, sanitized and bounded to 160
characters each. First and last touches each retain their own parameters. Path
length is bounded to 500; URLs retain only pathname and referrers only origin,
preventing query/fragment/userinfo leaks. First touch expires after 90 days with
no sliding renewal. New marketing entries update last touch; Direct does not erase
it. Session Direct context is saved separately. Cookie payloads exceeding 3500
encoded characters fall back to localStorage. Storage denial degrades gracefully.

Google Ads uses gclid/gbraid/wbraid or paid Google UTM. Meta Ads requires paid
signals; fbclid alone is Organic Social. Microsoft Ads recognizes msclkid. Search
engines, external referrals, ordinary campaigns, Direct and Unknown are separate.
The conversion source_label is the most recent retained marketing source (last).

Explicit Consent Mode analytics_storage denial prevents attribution persistence,
GA events and the click record request; existing first-party attribution is cleared
on the next tracker read. Consent updates made elsewhere remain authoritative.
No new consent UI or legal categorization is introduced by this change. No tags
are invoked to override denial. No GA/Ads configuration has been changed.

## GA4 payload

whatsapp_click: lead_id, event_id, source_label, first_source, first_medium,
last_source, last_medium, campaign, conversion_page, whatsapp_location,
cta_location, page_path, lead_type=whatsapp_click.

Locations: header, footer, floating_button, contact_page, tour_page, hero_section,
mobile_button, page_content. Existing data-cta-location attributes are preserved.
No name, email, phone, typed message, link text, complete link URL, referrer URL
or raw click identifier is sent to GA4 by this event. Full attribution is in the
same-origin receiver/email, not the WhatsApp message or GA event. Existing optional
Google Ads direct-send logic remains unchanged; review the earlier tracking doc
before enabling both direct Ads conversions and GA4-imported conversions.

## Persistent record and configuration

There is no database in the current project. Each accepted click generates a
**separate email record**, clearly titled `[WhatsApp click — unconfirmed] <Ref>`.
This is not a successful inquiry notification. It includes full sanitized first,
last and session attribution, CTA/page/device/language and matching reference.
It uses the existing RESEND_API_KEY, ENQUIRY_FROM_EMAIL (or
CUSTOM_JOURNEY_FROM_EMAIL), and ENQUIRY_TO_EMAIL (or the existing site inbox).
No new environment variables or external services are required. These records
consume the existing email provider quota. Incoming WhatsApp messages can be
matched manually via Ref; the site cannot confirm message sending automatically.

## Validation

Commands: `npm run test:whatsapp`, `npx next typegen`, `npx tsc --noEmit`,
`npm run build`, `git diff --check`.

22 automated tests cover paid/organic/direct/referral/Meta/Microsoft sources,
first-touch protection, last-touch updates, Direct session, expiry, internal/www
referrers, reload/SPA/language persistence, malformed/blocked storage and independent
fallback, encoding/ID uniqueness, every button location, native activation,
debounce, lifecycle cleanup, dynamically inserted CTAs, sharing exclusion, denied
analytics consent, mocked email success/failure, safe server validation and
server-side reclassification. Mocked tests do not deliver email.

Manual GA4 test:
1. Use Tag Assistant/DebugView with a test campaign URL in a fresh browser profile.
2. Navigate internally, then click a consultation CTA once.
3. Confirm one whatsapp_click with the reference and expected page/location/source.
4. Match the reference to the WhatsApp prefill and unconfirmed email record.
5. Rapid double-click: one reference/event. Journal Share: no inquiry event.
6. No generate_lead should fire from clicking WhatsApp.

Google Ads test: use gclid=test_gclid_123 and the documented ValueTrack-compatible
UTMs to verify website attribution only. A synthetic gclid does not establish a
real Google Ads conversion. Actual Ads attribution and DebugView receipt must be
verified inside the linked accounts; no account configuration is changed here.

## Limits

- Automated mobile tests verify URL construction/encoding only; real iPhone Safari
  and Android Chrome app handoff requires physical devices and installed WhatsApp.
- Right-click Copy Link/Open in new tab cannot be observed as a normal activation;
  the copied link has the greeting but may not have a fresh reference/record.
- JavaScript disabled, ad blockers, analytics not yet ready, browser storage expiry,
  revoked consent, network failures and email quota can reduce tracking coverage.
- keepalive improves delivery on navigation but does not guarantee it. Failed
  click records are not shown to visitors or retried on a future visit.
- Resend idempotency is provider-window scoped; the per-IP burst guard is local to
  a warm function instance and is not a distributed anti-abuse database.
- Website attribution is client-reported context, not fraud-proof advertising
  attribution. No cross-device matching or automatic sent-message detection.

## Rollback

Base production commit: 5db9eb3100dc15d6e8ad8b16321f3aa51133af33.
Revert the unified WhatsApp implementation commit and deploy the resulting commit.
Alternatively restore the preceding production deployment
`dpl_7SJKw54e2B8URyATmAr69vuTmdzp` in Vercel. No database migrations, secrets or GA
changes need reverting. Existing attribution cookies become unused and expire;
the stored click emails remain in the inbox for audit.

## Changed files

- `docs/whatsapp-tracking.md`
- `package-lock.json`
- `package.json`
- `src/app/[lang]/about-us/page.tsx`
- `src/app/[lang]/contact/page.tsx`
- `src/app/[lang]/custom-china-tour/page.tsx`
- `src/app/[lang]/layout.tsx`
- `src/app/[lang]/page.tsx`
- `src/app/[lang]/survival-kit/page.tsx`
- `src/app/[lang]/traveler-stories/page.tsx`
- `src/app/api/whatsapp-click/route.ts`
- `src/components/analytics-tracker.tsx`
- `src/components/article-discovery-flow.tsx`
- `src/components/contact-form.tsx`
- `src/components/content-footer.tsx`
- `src/components/floating-whatsapp-experiment.tsx`
- `src/components/journey-page.tsx`
- `src/components/journey-quote-band.tsx`
- `src/components/quick-ask.tsx`
- `src/components/site-header-client.tsx`
- `src/components/travel-journal-page.tsx`
- `src/components/whatsapp-tracker.tsx`
- `src/lib/attribution.ts`
- `src/lib/whatsapp-tracking.ts`
- `src/lib/whatsapp.ts`
- `src/lib/yunnan-guide-content.ts`
- `tests/whatsapp-tracking.test.cjs`
