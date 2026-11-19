# Private driver payments

The product cards show guide prices per standard vehicle. Staff confirm availability, the final route, the vehicle, the total and the written cancellation terms before creating Checkout. The card price never enters Checkout.

Keep the confirmed quote outside the repository. Example for a fixed transfer:

```json
{
  "orderId": "HCT-DRIVER-001",
  "bookingType": "transfer",
  "totalFen": 88000,
  "description": "Two hotel transfers as agreed in your written quote",
  "cancellationTerms": "See the written terms confirmed for HCT-DRIVER-001."
}
```

Use `fixed-day` for a single day with confirmed route and hours, or `flexible` for multi-day or adjustable service. For flexible quotes, include a `balanceDue` with the agreed date, time and time zone. Optional `email` prefills Checkout. The script prints the exact amount and link expiry. Keep the Checkout session ID against the order. The initial link charges the full amount or the 20% deposit based on booking type.

Load the operator's Stripe secret key into the local process environment and run `node scripts/create-driver-checkout.mjs path/to/quote.json`. Use a test key for validation. For flexible bookings, verify the deposit in Stripe before issuing the balance through the same command with the additional `balance` argument. Check the existing session status before reissuing an expired or previously sent link, including when retrying outside Stripe's idempotency window.

In Stripe live mode, register the production site's public `/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Store that endpoint's signing secret as sensitive `STRIPE_DRIVER_LIVE_WEBHOOK_SECRET` in the production environment and deploy. Resend uses the existing enquiry sender and recipient. Test webhook settings remain scoped to Preview.

## Guest order tracking

Driver requests are saved to a private Vercel Blob store when `BLOB_READ_WRITE_TOKEN` and `DRIVER_ORDER_LINK_SECRET` are set. Use a separate secret and store for production. Do not rotate the link secret without planning how to replace previously issued links. The enquiry email includes the guest link, which the customer also sees after submission. A separate acknowledgement shares the link when the customer supplies email. For a WhatsApp-only enquiry, forward the link from the operator email.

For local staff commands load the same storage token, set `DRIVER_ORDER_ENV=preview` (or `production`) and set `DRIVER_ORDER_SITE_URL` to that environment's site URL. Use the existing request UUID as `orderId` in the quote file. The Checkout script attaches the quote and payment link to the guest order. The Stripe webhook verifies the Checkout session and updates the paid amount before sending a notification. Send the guest a message when the quote is ready.

After verifying the initial payment and allocating the vehicle, run `node scripts/confirm-driver-pickup.mjs <order-id> <pickup.json>`. The file contains `pickup` (time, time zone, and meeting point) and `driver` (name, plate, and contact number). This publishes the pickup details on the guest's private page.

## Kunming Airport & Railway Station: complete USD 1 Preview checkout

This experiment exists **only** on `feat/driver-stripe-preview-integration` when
`VERCEL_ENV=preview` and `VERCEL_GIT_COMMIT_REF` matches the branch. It does not
modify real RMB guide fares or production orders. The Kunming card shows USD 1
for either vehicle type in this Preview. Other product cards/forms still only
request quotes.

Workflow: choose Kunming transfer → fill required hub, direction, address (or
airport→South Station), date/time, flight/train information for pickups,
passengers, luggage and contact → review the saved choices, amount and
sandbox-only consent → POST `/api/stripe/kunming-test-checkout` → server
validates the entire form again, persists a private order in Vercel Blob,
creates a USD 1 Stripe **test-mode** Checkout Session with the order UUID in
`client_reference_id`, returns the session URL → Stripe redirects to
`/{lang}/payment-success` → a signed webhook verifies amount/currency/order
and marks `paid.test` in Blob → private `/driver-order/{access}` displays
order details, HCT Ref, and the webhook-confirmed status.

**Required Vercel environment variables for this Git branch only:**

- `STRIPE_DRIVER_TEST_CHECKOUT_ENABLED=true` (set; Preview branch-scoped)
- `STRIPE_SECRET_KEY=sk_test_...` (must be supplied from Stripe test mode;
  never commit the key; Preview branch-scoped)
- `STRIPE_WEBHOOK_SECRET=whsec_...` (signing secret from the **test-mode**
  Stripe webhook destination for this Preview URL; Preview branch-scoped)
- `BLOB_READ_WRITE_TOKEN` (existing private Blob storage token; do not place
  it in the client)
- `DRIVER_ORDER_LINK_SECRET` (set; random sensitive value, Preview branch-scoped)
- `RESEND_API_KEY`, `CUSTOM_JOURNEY_FROM_EMAIL` (already shared; only used
  for an optional payment notification, never to decide if the order is paid)

Register the deployment's `https://<preview-domain>/api/stripe/webhook` as a
Stripe **test** destination for `checkout.session.completed` and
`checkout.session.async_payment_succeeded`, then put that destination's
`whsec_` into the branch variable. Redeploy after changing environment
variables. With no `sk_test_` key the Preview booking and US$1 review remain visible, but the payment API returns a setup error and cannot start Checkout. A static Stripe Payment Link cannot
be used for this order-bound Checkout workflow.

**Expected checks:** submit valid transfer, verify review details and $1,
open checkout, pay with a Stripe test card, return to success page, verify
order ID / Ref and `paid.test` from the signed webhook, refresh private order
link, verify amount USD 1 and no real booking. Cancel checkout: the order
must remain unpaid. Duplicate webhook: no duplicate paid amount. Invalid
product / forged amount / production request: payment endpoint must reject.

**Important:** A successful sandbox payment never reserves a vehicle or
constitutes a live deposit. Do not connect the order to real fulfillment.

### Stripe sandbox payment emails and protected Preview

For the branch's US$1 Kunming test, the signing Webhook (not the success-page
redirect) confirms payment and stores `paid.test`. Both Stripe Test Payment
Link and dynamic Checkout send the operator's transaction email via Resend.
The email contains order UUID, HCT Ref, route, date, passengers, customer
contact, US$1 amount and Stripe session. Successful Resend delivery request
stores `notifications.paymentEmail` on the private order page; email failures
return a retryable webhook error. The email is a TEST notification, never a
real driver confirmation.

Stable branch alias for the Webhook:
`https://hiddenchinatravel2-git-feat-driver-573269-liujiao111s-projects.vercel.app/api/stripe/webhook`

**Important:** Vercel Authentication protects Preview deployments. Stripe
cannot reach the above URL unauthenticated. Configure a Vercel
Protection Bypass for Automation for this test and append the secret in
Stripe's test Webhook destination URL as a confidential
`x-vercel-protection-bypass` query parameter. A bypass secret grants access
to protected deployments of this project, so never commit or share it,
and revoke it after testing. Do not disable the project's entire protection.

Create a Stripe TEST-mode Webhook destination for
`checkout.session.completed` and
`checkout.session.async_payment_succeeded`. Set its generated signing
secret as branch-scoped Preview `STRIPE_WEBHOOK_SECRET`, redeploy, and
make a fresh US$1 sandbox checkout. The previous
`codex/stripe-driver-test` Webhook signing variable is **sensitive** and
scoped to that old branch; copying the Payment Link alone does not make the
new Webhook work. Without the signed, accessible Webhook, a completed
Stripe payment does not trigger the order's payment-confirmation email.
