# GA4 & Google Ads conversion tracking

Last reviewed: 2026-10-28

## Purpose

Keep a reliable record of the lead-tracking setup for Hidden China Travel so future debugging does not accidentally add duplicate tags or count form attempts as real leads.

## Current architecture

```text
Website event tracking (src/lib/analytics.ts)
  -> GA4 events
  -> GA4 key events imported into Google Ads
```

The site uses the Google tag/gtag integration already in the application. The two Google Ads conversion actions were configured by importing the GA4 key events. **Do not add GTM or a second Google Ads conversion tag for these same actions unless the measurement design is intentionally changed.** Duplicate GA4 imports and direct Ads sends can inflate counts.

GA4 measurement configuration is supplied through the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable. Keep credentials and live environment values out of this document.

## Events and meaning

| Event | Meaning | Recommended use |
|---|---|---|
| `generate_lead` | Enquiry API accepted a valid form submission successfully | GA4 key event; Google Ads **Primary** conversion |
| `whatsapp_click` | Visitor clicked a WhatsApp link/button | GA4 key event; Google Ads **Secondary** conversion initially |
| `form_submit_attempt` | Visitor attempted to submit the contact form | Diagnostic only; do not mark as a key event |
| `form_start` | Visitor started interacting with the form, where implemented | Funnel diagnostic only; do not mark as a key event |

A WhatsApp click is not proof that a message was sent or that a qualified lead was generated. Review actual WhatsApp conversations separately.

## Form implementation

File: `src/components/contact-form.tsx`

- Before the request to `/api/enquiry`, the form sends `form_submit_attempt`.
- It sends `generate_lead` **only after** `/api/enquiry` returns an OK response.
- If the API returns an error or the request throws, `generate_lead` is not sent.
- Event parameters include form name, travel window, interest, and page path. Do not add names, email addresses, phone numbers, message text, or other personally identifiable information to analytics events.
- The successful form state displays “Thank you. Joy has your note.”

The tracking fix was committed on 2026-10-28 in commit `b8d07792ba9eddfe5bafa30f1a534bbc9adeabb2` (“Track successful enquiry submissions as generate_lead”). The corresponding Vercel production deployment was reported READY at the time of review. A READY deployment confirms deployment status, not that a browser event has been independently verified in GA4 DebugView.

## Google Ads configuration

The site owner reports that both `generate_lead` and `whatsapp_click` are marked as GA4 key events and their conversion actions were imported into Google Ads.

Recommended configuration:
1. `generate_lead`: Primary conversion, included in the relevant campaign goals.
2. `whatsapp_click`: Secondary conversion while validating lead quality; use it for observation rather than letting a click alone drive bidding.
3. Confirm the campaign's selected goals match this intent.
4. Because these actions are imported from GA4, do not create a parallel GTM/direct Google Ads conversion for the same event.

### Important implementation note

`src/lib/analytics.ts` also contains optional direct Google Ads conversion-send logic controlled by:
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`
- `NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL`

The user reported the current setup uses GA4-imported conversions; the presence of this optional code does **not** prove these environment variables are configured. Before enabling them, check the production Vercel environment. If direct Google Ads sends are enabled for the same actions while GA4 imports remain active, review conversion-action setup carefully to prevent duplicate counting. Do not expose variable values in logs, screenshots, or documentation.

## Troubleshooting checklist

### 1. Verify in GA4 DebugView first

Use a fresh browser session and submit a test enquiry:
- `form_submit_attempt` should fire when the form is submitted.
- `generate_lead` should fire only after the API succeeds.
- Confirm the success message appears.
- If the API fails, `generate_lead` should not fire.

For WhatsApp, click the website's WhatsApp link and check for `whatsapp_click`. This verifies the click only, not that a message was sent.

### 2. If GA4 does not show the event

- Confirm the production page is using the expected GA4 measurement ID.
- Check browser developer tools for JavaScript errors, blocked Google tag requests, consent/ad blockers, or network failures.
- Inspect the network requests and GA4 DebugView; a cached third-party reporting connector may lag and is not the source of truth for a live test.
- Verify the production deployment contains the expected code commit.
- Do not add GTM as the first troubleshooting step.

### 3. If GA4 shows the event but Google Ads does not

- Confirm the intended GA4 property is linked to the correct Google Ads account.
- Confirm the right GA4 key events were imported and their conversion-action status is healthy.
- Check Primary/Secondary status and campaign goals.
- Allow for reporting/attribution delay; a newly imported action or test visit may not immediately appear in standard Google Ads reports.
- Confirm the test visit has eligible Google Ads attribution. A direct test submission is not necessarily attributed to an ad click.

### 4. If conversion totals look doubled

- Check whether the same event is imported from GA4 and also sent directly through Google Ads tags.
- Check whether multiple conversion actions represent the same outcome.
- Keep `generate_lead` as the business lead metric; do not substitute `form_submit_attempt` or WhatsApp clicks for successful enquiries.

## Related files

- `src/lib/analytics.ts` — shared GA4 event dispatch and optional direct Google Ads conversion logic.
- `src/components/contact-form.tsx` — contact form submit-attempt and successful-lead events.
- `docs/custom-journey-enquiries.md` — separate `/custom-china-tour` enquiry flow and its API/email behaviour.

## Scope and verification status

This document records code behaviour and the account setup reported by the site owner. It does not claim that a live test event has been confirmed in DebugView or that Google Ads has already attributed a conversion. Re-run the troubleshooting checklist after tracking changes, consent changes, or analytics environment changes.
