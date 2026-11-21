# Custom journey enquiries

`/custom-china-tour` uses a server-side POST endpoint at `/api/custom-journey` to notify Joy by email. It does not redirect to WhatsApp or claim success when email submission fails.

Configure these server-only Vercel environment variables for production and any preview used for a delivery test:

- `RESEND_API_KEY`: a Resend sending key.
- `CUSTOM_JOURNEY_FROM_EMAIL`: the existing deployed sender on a verified Resend domain. `ENQUIRY_FROM_EMAIL` is also supported and takes precedence if set. Existing variables do not need to be renamed.
- `ENQUIRY_TO_EMAIL`: optional; falls back to `CUSTOM_JOURNEY_TO_EMAIL`, then `joy.liu@hiddenchinatravel.com`.

These are the existing site enquiry settings; driver requests and Stripe notifications reuse them. Redeploy after configuration changes. Submit an enquiry, check the Resend delivery status and verify receipt in the target inbox. Reply-To uses the customer's email. No marketing subscription is created. Driver requests with order storage enabled also receive an acknowledgement containing their private order link when an email address is supplied. API acceptance is not proof of inbox delivery.

The endpoint validates and bounds fields, requires same-origin JSON requests and consent, checks a honeypot, and sends only to the configured recipient. A warm-instance burst guard is included but is not a distributed rate limiter. Resend idempotency prevents duplicate sends on retries with the same request and content. No enquiry body or email address is sent to GA4 or logged by this endpoint.

GA4 records `custom_journey_form_start` and `generate_lead` (only after the email API accepts the request). The latter can be marked as a key event in GA4.

Until sending is configured, the API returns 503 and the form retains the customer's inputs with WhatsApp and email alternatives. Do not describe this deployment as having verified email delivery until the provider and inbox checks pass.

Local preview does not automatically inherit Vercel credentials. The current project has the mail key in Production/Preview only. Its Secret cannot be read back through an environment pull. Use a separately supplied local development key in gitignored `.env.local`, or verify real delivery on the configured Preview deployment. Never simulate a successful send when credentials are missing.
