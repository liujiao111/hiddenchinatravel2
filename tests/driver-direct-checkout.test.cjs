const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
let stored, calls, enabled = true;
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const load = Module._load;
Module._load = function(name, parent, main) {
  if (name === '@/lib/driver-orders.mjs') return {
    driverOrdersEnabled: () => enabled,
    saveDriverRequest: async (_id, summary) => stored ||= { summary, access: 'local-private-link' },
    updateDriverOrder: async (_id, change) => stored = change(stored),
  };
  if (name === 'stripe') return class {
    checkout = { sessions: {
      create: async (input, options) => { calls.push({ input, options }); return { id: 'cs_test_direct', url: 'https://checkout.stripe.com/c/pay/test-local', livemode: false, expires_at: 2000000000 }; },
      retrieve: async () => ({ status: 'open', url: stored.quote.initial.url }),
    } };
  };
  return load.call(this, name, parent, main);
};
const { createDirectDriverCheckout } = require('../src/lib/driver-direct-checkout.ts');
function setup() {
  stored = undefined; calls = []; enabled = true;
  process.env.VERCEL_ENV = 'preview';
  process.env.STRIPE_SECRET_KEY = 'sk_test_local';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local';
  process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED = 'true';
}
const input = () => ({ id: 'local-order', submissionKey: 'local-key', totalFen: 55000, origin: 'https://preview.example.com', summary: { service: 'Dali to Lijiang', email: 'test@example.com' } });
test('direct checkout charges full server amount, saves the session for webhook matching and reuses it on retry', async () => {
  setup();
  const first = await createDirectDriverCheckout(input());
  assert.equal(calls[0].input.line_items[0].price_data.unit_amount, 55000);
  assert.equal(calls[0].input.metadata.payment_type, 'full');
  assert.equal(calls[0].input.metadata.linked_driver_order, '1');
  assert.equal(stored.quote.initial.id, 'cs_test_direct');
  assert.equal(stored.quote.totalFen, 55000);
  assert.equal((await createDirectDriverCheckout(input())).checkoutUrl, first.checkoutUrl);
  assert.equal(calls.length, 1);
});
test('missing configuration and live credentials on Preview cannot create a checkout', async () => {
  setup(); enabled = false;
  await assert.rejects(createDirectDriverCheckout(input()), /not configured/);
  enabled = true; process.env.STRIPE_SECRET_KEY = 'sk_live_wrong_environment';
  await assert.rejects(createDirectDriverCheckout(input()), /not configured/);
  assert.equal(calls.length, 0);
  assert.equal(stored, undefined);
});
