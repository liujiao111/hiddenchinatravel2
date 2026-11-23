const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);

const load = Module._load;
Module._load = function(name, parent, main) {
  if (name === '@/lib/stripe-test') return {
    getDriverStripeTestMode: () => 'live',
    getDriverLiveTestPaymentLink: () => new URL('https://buy.stripe.com/live-verification'),
    getDriverTestPaymentLink: () => null,
    getStripeTestClient: () => null,
    getSiteUrl: () => 'https://hiddenchinatravel.com',
    isDriverProductId: id => id === 'dali-lijiang-direct',
  };
  return load.call(this, name, parent, main);
};

const { POST } = require('../src/app/api/stripe/driver-test-checkout/route.ts');

function request(token) {
  return {
    headers: new Headers(token ? { 'x-driver-test-token': token } : {}),
    nextUrl: { origin: 'https://hiddenchinatravel.com' },
    json: async () => ({ productId: 'dali-lijiang-direct', locale: 'zh' }),
  };
}

test('live verification checkout requires the exact private token and adds an order reference', async () => {
  process.env.STRIPE_DRIVER_LIVE_TEST_TOKEN = 'a'.repeat(64);
  assert.equal((await POST(request('b'.repeat(64)))).status, 404);
  assert.equal((await POST(request())).status, 404);

  const response = await POST(request('a'.repeat(64)));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.mode, 'live');
  const url = new URL(body.url);
  assert.equal(url.hostname, 'buy.stripe.com');
  assert.equal(url.searchParams.get('client_reference_id'), 'driver_live_test_dali-lijiang-direct');
});
