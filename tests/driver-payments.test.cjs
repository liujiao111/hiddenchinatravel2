const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const Stripe = require('stripe');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
let order, messages, emailOK;
const load = Module._load;
Module._load = function(name, parent, main) {
  if (name === '@/lib/driver-orders.mjs') return {
    driverOrdersEnabled: () => true,
    updateDriverOrder: async (_id, change) => (order = change(order)),
  };
  if (name === '@/lib/stripe-test') return { isDriverProductId: id => id === 'dali-arrival' };
  return load.call(this, name, parent, main);
};
const { POST } = require('../src/app/api/stripe/webhook/route.ts');
const secret = 'whsec_local_test_only';
function setup() {
  process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET = secret;
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_sandbox_only';
  process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED = 'true';
  process.env.RESEND_API_KEY = 'local_mock';
  process.env.ENQUIRY_FROM_EMAIL = 'sender@example.com';
  process.env.ENQUIRY_TO_EMAIL = 'operations@example.com';
  messages = []; emailOK = true;
  order = { quote: { totalFen: 10000, initial: { id: 'cs_live_local', dueFen: 10000, type: 'full', live: true } } };
  global.fetch = async (_url, options) => {
    messages.push({ body: JSON.parse(options.body), headers: options.headers });
    return { ok: emailOK, status: emailOK ? 200 : 500 };
  };
}
function event(overrides = {}) {
  return { id: 'evt_local', created: 1800000000, livemode: true, type: 'checkout.session.completed',
    data: { object: { id: 'cs_live_local', payment_status: 'paid', amount_total: 10000, currency: 'cny',
      client_reference_id: 'order-1', metadata: { purpose: 'driver_quote_payment', order_id: 'order-1',
        payment_type: 'full', total_fen: '10000', due_fen: '10000', linked_driver_order: '1' }, ...overrides } } };
}
function request(body, signingSecret = secret) {
  const payload = JSON.stringify(body);
  return new Request('https://example.com/api/stripe/webhook', { method: 'POST', body: payload,
    headers: { 'stripe-signature': Stripe.webhooks.generateTestHeaderString({ payload, secret: signingSecret }) } });
}
test('verified live payment updates the order and reuses the enquiry mailbox; duplicates stay idempotent', async () => {
  setup();
  assert.equal((await POST(request(event()))).status, 200);
  assert.equal(order.paid.initial.amount, 10000);
  assert.ok(order.paid.initial.notificationSentAt);
  assert.equal(messages[0].body.from, 'sender@example.com');
  assert.deepEqual(messages[0].body.to, ['operations@example.com']);
  const paidAt = order.paid.initial.paidAt;
  assert.equal((await POST(request(event()))).status, 200);
  const asynchronous = event(); asynchronous.type = 'checkout.session.async_payment_succeeded';
  assert.equal((await POST(request(asynchronous))).status, 200);
  assert.equal(order.paid.initial.paidAt, paidAt);
  assert.equal(messages.length, 1);
});
test('invalid signature, wrong environment, mismatched amount/session and unpaid events cannot mark an order paid', async () => {
  setup();
  assert.equal((await POST(request(event(), 'whsec_wrong'))).status, 400);
  assert.equal((await POST(request(event(), 'whsec_sandbox_only'))).status, 400);
  assert.equal((await POST(request(event({ amount_total: 9999 })))).status, 422);
  assert.equal((await POST(request(event({ id: 'cs_live_other' })))).status, 503);
  assert.equal((await POST(request(event({ payment_status: 'unpaid' })))).status, 200);
  assert.equal(order.paid, undefined);
  assert.equal(messages.length, 0);
});
test('email failure preserves paid status and a retry delivers the notification once', async () => {
  setup(); emailOK = false;
  assert.equal((await POST(request(event()))).status, 502);
  assert.equal(order.paid.initial.amount, 10000);
  assert.equal(order.paid.initial.notificationSentAt, undefined);
  emailOK = true;
  assert.equal((await POST(request(event()))).status, 200);
  assert.equal(messages[0].headers['Idempotency-Key'], messages[1].headers['Idempotency-Key']);
  assert.ok(order.paid.initial.notificationSentAt);
  assert.equal((await POST(request(event()))).status, 200);
  assert.equal(messages.length, 2);
});
