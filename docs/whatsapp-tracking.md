# Unified WhatsApp consultation tracking

Updated 2026-11-05: the shared greeting now says **Yunnan**. WhatsApp clicks no
longer send email notifications. Existing successful form submission emails are
unchanged.

## Customer template

Identical across every consultation CTA and page, including /zh:

```text
Hi Joy, I'd like help planning a private trip to Yunnan.

Ref: HCT-20261105-<16 random hex characters>
```

No Source, Campaign, Page, ad IDs or personal form fields are added to this message.
The reference is generated on activation, not rendering. Existing styling, phone,
targets, floating visibility rules, form fields/APIs, GA configuration and SEO are
preserved. No-JS links have the greeting but no new reference or tracking record.
Journal share-to-friends links retain their share text and are excluded from leads.

## Architecture and source audit

Next.js 16 App Router, React 19, next-intl; static and server rendered routes with
client navigation. English is unprefixed and Chinese uses /zh. The locale layout
loads the existing gtag instance once. No additional tag or consent UI is added.

- `src/lib/whatsapp.ts`: shared greeting, phone-specific matcher and random ID.
- `src/lib/attribution.ts`: first, last marketing and current-session attribution.
- `src/lib/whatsapp-tracking.ts`: one delegated click handler, 1.5s per-button
  debounce, middle-click support and dynamic CTA normalization with cleanup.
- `src/components/whatsapp-tracker.tsx`: shared layout lifecycle.
- `src/app/api/whatsapp-click/route.ts`: same-origin, bounded, sanitized diagnostic
  receiver. **It never imports Resend or sends email.**

The old generic analytics handler incorrectly counted journal sharing as inquiry
clicks; that path was removed. All header, footer, floating, contact, hero, mobile,
journey, article and form success/fallback consultation URLs use the same builder.
The native link opens immediately; fetch keepalive runs without delaying WhatsApp.

Forms retain their existing flow: ContactForm/QuickAsk -> /api/enquiry -> Resend;
CustomJourneyForm -> /api/custom-journey -> Resend. Their successful submission
notifications and generate_lead events are separate from WhatsApp clicks.

## Attribution and analytics

The 11 click/UTM keys are allowlisted and bounded to 160 characters each. First
and last touches retain their own parameters. First-party cookie storage has a
90-day expiry without sliding renewal, with independent localStorage fallback.
Session entry deduplication uses sessionStorage. Direct does not overwrite an
existing last marketing source. Internal navigation and language changes retain
attribution without needing query parameters copied to each link.

Google Ads uses gclid/gbraid/wbraid or paid Google UTM. Meta Ads needs paid signals;
fbclid alone is Organic Social. Microsoft Ads, organic engines, referrals, ordinary
campaigns, Direct and Unknown are distinguished. Source labels are recomputed on
the server rather than trusting client-reported labels. Referrers retain origin
only; page fields retain pathname only, without query strings or fragments.

`whatsapp_click` parameters: lead_id, event_id, source_label, first_source,
first_medium, last_source, last_medium, campaign, conversion_page,
whatsapp_location, cta_location, page_path, lead_type=whatsapp_click.

No names, emails, phone numbers, typed messages, link text, full URLs, referrers or
raw click identifiers are added to GA4 by this event. Existing Google Ads settings
remain unchanged. A click never triggers generate_lead or message_sent.

Explicit Consent Mode analytics_storage denial prevents GA events, attribution
persistence and the diagnostic request; stored attribution is cleared on the next
read. WhatsApp remains usable. Browser storage denial degrades gracefully.

## Silent server diagnostics (no click emails)

The endpoint emits one structured `[whatsapp_click]` console.info record containing
the Ref, sanitized first/last/session attribution, page, CTA, device and language.
Records are explicitly marked as unconfirmed. Duplicate references are suppressed
for ten minutes within a warm instance. Origin/type/16KB-body checks, sanitation
and a bounded IP burst guard remain in place. No new environment variables or
email-provider quota are needed for this endpoint.

These are hosting runtime logs, **not a persistent inquiry database or CRM**. Their
availability and retention depend on the hosting plan. GA4 still supplies click
reporting, while browser storage retains visitor attribution where permitted.
After logs expire, matching a Ref to its full original attribution is not guaranteed.
No long-term database, new subscription or customer-message detection is added.

## Validation

`npm run test:whatsapp` runs 23 automated tests covering source classification,
first/last/session protection, expiry, SPA/language persistence, cookie/localStorage
fallback and denial, uniform Yunnan text, ID uniqueness/encoding, CTA locations,
sharing exclusion, debounce, lifecycle cleanup, native activation, consent denial,
sanitized logs, duplicate references, no email-provider usage, receiver input checks
and operation without email credentials. Run `npx tsc --noEmit`, `npm run build`
and `git diff --check` for compilation/build/patch checks.

Live check: click once with Tag Assistant/GA4 DebugView active, confirm exactly one
whatsapp_click with the correct Ref/page/location/source, and match the Ref to the
prefill and runtime log. Rapid double-click should keep the same Ref; journal Share
should produce no inquiry event. No email should arrive from a WhatsApp click.
Normal valid form submissions should still produce their existing emails.

A fake gclid tests website attribution only; it does not prove real Ads conversion
eligibility. Physical iPhone Safari/Android Chrome app handoff and live analytics
receipt require separate verification. Right-click Copy Link/Open in new tab may
not get a fresh Ref. Network failures, no-JS, ad blockers, consent and provider log
retention can reduce coverage; no automatic sent-message confirmation is possible.

## Follow-up files and rollback

This correction changes `src/lib/whatsapp.ts`,
`src/app/api/whatsapp-click/route.ts`, `tests/whatsapp-tracking.test.cjs` and this doc.
It leaves successful form email handlers untouched. Reverting this correction
restores the previous China greeting **and re-enables click emails**; prefer a
focused forward fix when only the wording needs adjustment.
