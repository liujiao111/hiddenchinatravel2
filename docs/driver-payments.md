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
