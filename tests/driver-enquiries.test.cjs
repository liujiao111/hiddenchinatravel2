const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const load = Module._load;
Module._load = function(name, parent, main) {
  if (name === '@/lib/driver-orders.mjs') return {
    driverOrdersEnabled: () => true, driverOrderAccess: id => `${id}.private-link`,
    saveDriverRequest: async (_id, summary) => ({ summary }),
  };
  if (name.startsWith('@/')) name = path.join(__dirname, '..', 'src', name.slice(2));
  return load.call(this, name, parent, main);
};
const { POST } = require('../src/app/api/custom-journey/route.ts');
const { parseAirportTransfer } = require('../src/lib/driver-airport-transfers.ts');
test('airport quote validation preserves the optional flight number in the current form', () => {
  const transfer = { productId: 'kunming-arrival', hubId: 'kmg', direction: 'pickup', hotelArea: 'central',
    hotel: 'Kunming hotel', transportNumber: '', serviceTime: '12:00', vehicle: 'Five-seat car', luggage: 1 };
  const parsed = parseAirportTransfer(transfer, '2027-05-01', 2, 0, 'en');
  assert.ok(parsed);
  assert.equal(parsed.transportNumber, '');
  assert.equal(parseAirportTransfer({ ...transfer, serviceTime: '99:00' }, '2027-05-01', 2, 0, 'en'), null);
});
function payload(overrides = {}) {
  return { name: 'Local test', email: 'guest@example.com', whatsapp: '', travelTiming: '2027-05-01',
    tripLength: '1 day', adults: 2, children: 0, destinations: 'Dali', budget: 'Please advise',
    comfort: 'Please advise', interests: [], notes: 'Driver request', consent: true, website: '',
    requestId: randomUUID(), conversionPage: '/yunnan-private-driver',
    driverOrder: { submissionKey: randomUUID(), locale: 'en', service: 'Dali day', route: 'Dali', vehicle: 'Five-seat car' },
    ...overrides };
}
function request(body, origin = 'https://example.com') {
  return new Request('https://example.com/api/custom-journey', { method: 'POST',
    headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': randomUUID() }, body: JSON.stringify(body) });
}
test('driver request reuses site email and returns the private order link; email and WhatsApp-only enquiries work', async () => {
  process.env.RESEND_API_KEY = 'local_mock'; process.env.ENQUIRY_FROM_EMAIL = 'sender@example.com';
  process.env.ENQUIRY_TO_EMAIL = 'operations@example.com';
  const messages = [];
  global.fetch = async (_url, options) => { messages.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'local_email' }) }; };
  const body = payload();
  const response = await POST(request(body));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).orderPath, `/driver-order/${body.requestId}.private-link`);
  assert.deepEqual(messages[0].to, ['operations@example.com']);
  assert.equal(messages[0].from, 'sender@example.com');
  assert.deepEqual(messages[1].to, ['guest@example.com']);
  assert.match(messages[1].text, /private-link/);
  messages.length = 0;
  assert.equal((await POST(request(payload({ email: '', whatsapp: '+6512345678' })))).status, 200);
  assert.equal(messages.length, 1);
});
test('invalid requests and email rejection do not claim successful submission', async () => {
  delete process.env.CUSTOM_JOURNEY_FROM_EMAIL;
  let calls = 0;
  global.fetch = async () => { calls++; return { ok: false, json: async () => ({ error: 'rejected' }) }; };
  assert.equal((await POST(request(payload({ email: '', whatsapp: '' })))).status, 400);
  assert.equal((await POST(request(payload({ consent: false })))).status, 400);
  assert.equal((await POST(request(payload(), 'https://other.example'))).status, 403);
  assert.equal(calls, 0);
  assert.equal((await POST(request(payload()))).status, 502);
  delete process.env.ENQUIRY_FROM_EMAIL;
  assert.equal((await POST(request(payload()))).status, 503);
});
test('the actual production sender configuration works without ENQUIRY_FROM_EMAIL', async () => {
  delete process.env.ENQUIRY_FROM_EMAIL;
  process.env.CUSTOM_JOURNEY_FROM_EMAIL = 'existing-production@example.com';
  process.env.RESEND_API_KEY = 'local_mock';
  const messages = [];
  global.fetch = async (_url, options) => { messages.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'local_email' }) }; };
  assert.equal((await POST(request(payload()))).status, 200);
  assert.equal(messages[0].from, 'existing-production@example.com');
  delete process.env.CUSTOM_JOURNEY_FROM_EMAIL;
});
