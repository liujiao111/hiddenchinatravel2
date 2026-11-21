# Private driver payments

Use Node 24 (`nvm use`) for builds and tests. Run `npm ci`, `npm test`, `npm run lint` and `npm run build` before release. Enquiries, guest acknowledgements and payment notifications all reuse `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` and `ENQUIRY_TO_EMAIL`; no driver-specific email configuration is required.

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

## Payment verification

Preview: submit a driver request and follow its private order link. Generate a confirmed-quote Checkout with the test key and the request UUID; complete payment in Stripe's sandbox. Verify the signed webhook updates that order's paid amount and sends the notification to the existing enquiry inbox. Re-deliver the webhook: the paid amount and notification count must remain unchanged. Failed notification sends return an error for retry while preserving the payment record.

Production: configure the live endpoint secret described above and production order storage. The public USD 1 test endpoint accepts only test credentials and remains disabled in production. The staff Checkout script supports live keys for confirmed production orders. Check the amount and currency before making an authorized live payment, then verify Stripe, the order page and the notification inbox. Do not use sandbox card numbers with a live Checkout. Refunds are handled in Stripe; automatic refund synchronization to the guest order page is not implemented.
