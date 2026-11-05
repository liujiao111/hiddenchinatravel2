const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const load = Module._load;
Module._load = function(name, parent, main) {
  if (name.startsWith('@/')) name = path.join(root, 'src', name.slice(2));
  if (name === 'resend') throw new Error('Click tracking must never load the email provider');
  return load.call(this, name, parent, main);
};
const a = require('../src/lib/attribution.ts');
const w = require('../src/lib/whatsapp.ts');
const tracking = require('../src/lib/whatsapp-tracking.ts');
const route = require('../src/app/api/whatsapp-click/route.ts');
const ads = 'https://hiddenchinatravel.com/?gclid=test_gclid_123&utm_source=google&utm_medium=cpc&utm_campaign=yunnan_private_tour&utm_term=private_yunnan_tour';
function touch(url = ads, ref = '', now = Date.now()) { return a.createTouch(new URL(url), ref, now); }
function browser(url = ads, ref = '') {
  const dom = new JSDOM('<body></body>', { url, ...(ref ? { referrer: ref } : {}) });
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, Element: dom.window.Element, MutationObserver: dom.window.MutationObserver, localStorage: dom.window.localStorage, sessionStorage: dom.window.sessionStorage, navigator: dom.window.navigator })) Object.defineProperty(globalThis, key, { configurable: true, value });
  const events = [], requests = [];
  window.gtag = (...args) => events.push(args);
  global.fetch = async (...args) => { requests.push(args); return { ok: true }; };
  // Suppress jsdom's navigation attempt while still checking our capture handler
  // leaves normal native activation intact before the test bubble handler runs.
  document.addEventListener('click', e => e.preventDefault());
  return { dom, events, requests };
}
function anchor(container = document.body, href = w.buildWhatsAppUrl()) {
  const link = document.createElement('a'); link.href = href; link.innerHTML = '<span>Chat</span>'; container.appendChild(link); return link;
}
function click(link) { link.firstChild.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); }
function request(body, overrides = {}) {
  return new Request('https://hiddenchinatravel.com/api/whatsapp-click', { method: 'POST', headers: { origin: 'https://hiddenchinatravel.com', 'content-type': 'application/json', 'x-forwarded-for': crypto.randomUUID(), ...overrides }, body: JSON.stringify(body) });
}
function recordBody() { return { lead_id: w.generateLeadId(), attribution: a.updateAttribution(null, touch(), Date.now()), conversion_page: '/journeys/test', whatsapp_location: 'tour_page' }; }

test('Google Ads, braid identifiers and organic search classification', () => {
  assert.equal(touch().source_label, 'Google Ads');
  assert.equal(touch().params.gclid, 'test_gclid_123');
  for (const key of ['gbraid', 'wbraid']) assert.equal(touch(`https://hiddenchinatravel.com/?${key}=x`).medium, 'cpc');
  assert.equal(touch('https://hiddenchinatravel.com/', 'https://www.google.co.uk/search?q=yunnan').source_label, 'Google Organic');
  assert.equal(touch('https://hiddenchinatravel.com/', 'https://www.bing.com/search?q=x').medium, 'organic');
});
test('Direct, Referral, Microsoft Ads, unknown incomplete UTM and Google spoof domain', () => {
  assert.equal(touch('https://hiddenchinatravel.com/').source_label, 'Direct');
  assert.equal(touch('https://hiddenchinatravel.com/', 'https://example.org/page').source_label, 'Referral');
  assert.equal(touch('https://hiddenchinatravel.com/?msclkid=example').source_label, 'Microsoft Ads');
  assert.equal(touch('https://hiddenchinatravel.com/?utm_campaign=abc').source_label, 'Unknown');
  assert.equal(touch('https://hiddenchinatravel.com/', 'https://google.com.evil.test/').source_label, 'Referral');
});
test('Meta paid traffic distinguished from ordinary Facebook sharing', () => {
  assert.equal(touch('https://hiddenchinatravel.com/?utm_source=facebook&utm_medium=paid_social').source_label, 'Meta Ads');
  assert.equal(touch('https://hiddenchinatravel.com/?fbclid=test').source_label, 'Organic Social');
});
test('First Touch protected; Direct preserves last marketing source; session records Direct', () => {
  const now = Date.now();
  const first = a.updateAttribution(null, touch(), now);
  const next = a.updateAttribution(first, touch('https://hiddenchinatravel.com/'), now + 1);
  assert.deepEqual(next.first, first.first); assert.deepEqual(next.last, first.last);
  assert.equal(next.session.source_label, 'Direct'); assert.equal(next.expires, first.expires);
});
test('Organic first / Meta last and 90-day expiry reset', () => {
  const now = Date.now();
  const first = a.updateAttribution(null, touch('https://hiddenchinatravel.com/', 'https://google.com/'), now);
  const meta = touch('https://hiddenchinatravel.com/?utm_source=meta&utm_medium=paid_social');
  const next = a.updateAttribution(first, meta, now + 1);
  assert.equal(next.first.source_label, 'Google Organic'); assert.equal(next.last.source_label, 'Meta Ads');
  assert.equal(a.updateAttribution(next, meta, now + 91 * 86400_000).first.source_label, 'Meta Ads');
});
test('Internal referrer and www alias cannot become Referral', () => {
  assert.equal(touch('https://hiddenchinatravel.com/contact', 'https://www.hiddenchinatravel.com/journeys').referrer, '');
});
test('Cookie/localStorage persist across SPA, language changes, module reload and refresh', () => {
  browser(); const first = a.getAttribution();
  assert.ok(document.cookie.includes(a.ATTRIBUTION_KEY)); assert.ok(localStorage.getItem(a.ATTRIBUTION_KEY));
  window.history.pushState({}, '', '/zh/contact');
  assert.deepEqual(a.getAttribution().first, first.first);
  assert.deepEqual(a.getAttribution().last, first.last);
  delete require.cache[require.resolve('../src/lib/attribution.ts')];
  assert.deepEqual(require('../src/lib/attribution.ts').getAttribution().first, first.first);
});
test('Same campaign refresh does not advance last source time; corrupt storage degrades safely', () => {
  browser(); const first = a.getAttribution();
  assert.equal(a.getAttribution().last.time, first.last.time);
  document.cookie = `${a.ATTRIBUTION_KEY}=broken; Path=/`;
  assert.equal(a.getAttribution().first.time, first.first.time);
  localStorage.setItem(a.ATTRIBUTION_KEY, 'not-json');
  assert.doesNotThrow(() => a.getAttribution());
});
test('A single template and high-entropy reference safely URL encode on mobile and desktop', () => {
  const ids = new Set(Array.from({ length: 1000 }, () => w.generateLeadId())); assert.equal(ids.size, 1000);
  for (const platform of ['iPhone Safari', 'Android Chrome', 'Desktop Chrome']) {
    const id = w.generateLeadId(); const url = new URL(w.buildWhatsAppUrl(id));
    assert.equal(w.WHATSAPP_MESSAGE, "Hi Joy, I'd like help planning a private trip to Yunnan."); assert.equal(url.hostname, 'wa.me', platform); assert.equal(url.pathname, '/8618880441791');
    assert.equal(url.searchParams.get('text'), `${w.WHATSAPP_MESSAGE}\n\nRef: ${id}`);
    assert.match(id, /^HCT-\d{8}-[A-F0-9]{16}$/);
    assert.ok(!url.searchParams.get('text').includes('Campaign:'));
  }
});
test('WhatsApp consultation matching excludes social share, another phone, spoof hosts, email and telephone', () => {
  for (const href of ['https://wa.me/?text=share', 'https://wa.me/1234', 'https://evilwhatsapp.com/?phone=8618880441791', 'mailto:joy@example.com', 'tel:123']) assert.equal(w.isConsultationWhatsApp(href), false, href);
  assert.equal(w.isConsultationWhatsApp('https://api.whatsapp.com/send?phone=8618880441791'), true);
});
test('Header, footer, floating, hero, mobile and tour buttons emit one event each without PII', () => {
  const { events, requests } = browser('https://hiddenchinatravel.com/journeys/example?gclid=test');
  const fixtures = [['header', 'site-header', 'header'], ['footer', 'footer', 'footer'], ['div', 'floating-whatsapp', 'floating_button'], ['header', 'journey-hero', 'hero_section'], ['div', 'journey-mobile-cta', 'mobile_button'], ['section', '', 'tour_page']];
  const cleanup = tracking.installWhatsAppTracking();
  for (const [tag, className, location] of fixtures) {
    const container = document.createElement(tag); container.className = className; document.body.appendChild(container);
    const link = anchor(container); if (location === 'floating_button') link.dataset.ctaLocation = 'floating_whatsapp';
    link.target = '_blank'; click(link);
    assert.equal(events.at(-1)[1], 'whatsapp_click'); assert.equal(events.at(-1)[2].whatsapp_location, location);
    assert.equal(link.target, '_blank'); assert.ok(new URL(link.href).searchParams.get('text').includes(events.at(-1)[2].lead_id));
    assert.equal(events.at(-1)[2].lead_type, 'whatsapp_click');
    assert.ok(!/email|phone|name|gclid|text|link_url/i.test(Object.keys(events.at(-1)[2]).join(' ')));
  }
  assert.equal(events.length, 6); assert.equal(requests.length, 6); cleanup();
});
test('Fast double clicks deduplicate both the event and reference; share links are not inquiries', () => {
  const { events, requests } = browser(); const cleanup = tracking.installWhatsAppTracking();
  const link = anchor(); click(link); const href = link.href; click(link);
  assert.equal(events.length, 1); assert.equal(requests.length, 1); assert.equal(link.href, href);
  click(anchor(document.body, 'https://wa.me/?text=share')); assert.equal(events.length, 1); cleanup();
});
test('Strict Mode cleanup/remount and SPA dynamic links cannot duplicate click handlers', async () => {
  const { events } = browser(); tracking.installWhatsAppTracking()();
  const cleanup = tracking.installWhatsAppTracking();
  const link = anchor(document.body, 'https://api.whatsapp.com/send?phone=8618880441791&text=old');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(new URL(link.href).searchParams.get('text'), w.WHATSAPP_MESSAGE);
  click(link); assert.equal(events.length, 1); cleanup();
});
test('Contact page location and failed click receiver never block normal activation', async () => {
  const { events } = browser('https://hiddenchinatravel.com/zh/contact');
  global.fetch = () => Promise.reject(new Error('network offline'));
  const cleanup = tracking.installWhatsAppTracking(); const link = anchor();
  let blockedByTracker; link.addEventListener('click', event => { blockedByTracker = event.defaultPrevented; });
  click(link); await new Promise(resolve => setImmediate(resolve));
  assert.equal(blockedByTracker, false); assert.equal(events[0][2].whatsapp_location, 'contact_page'); cleanup();
});
test('Explicit analytics denial keeps WhatsApp usable without events, records or tracking storage', () => {
  const { events, requests } = browser(); a.getAttribution();
  window.dataLayer = [['consent', 'default', { analytics_storage: 'denied' }]];
  const cleanup = tracking.installWhatsAppTracking(); const link = anchor(); click(link);
  assert.equal(events.length, 0); assert.equal(requests.length, 0); assert.equal(localStorage.getItem(a.ATTRIBUTION_KEY), null);
  assert.equal(document.cookie.includes(a.ATTRIBUTION_KEY), false); assert.ok(link.href.includes('Ref%3A')); cleanup();
});
async function captureReceiver(body) {
  const logs = []; const originalInfo = console.info;
  console.info = (...args) => logs.push(args);
  try { return { response: await route.POST(request(body)), logs }; }
  finally { console.info = originalInfo; }
}
test('Receiver logs sanitized attribution without email or URL query data', async () => {
  const body = recordBody(); body.conversion_page = '/contact?email=private@example.com'; body.cta_location = '<script>\r\nBcc: victim@example.com';
  const { response, logs } = await captureReceiver(body);
  assert.equal(response.status, 200); assert.equal(logs.length, 1);
  assert.equal(logs[0][0], '[whatsapp_click]');
  const record = JSON.parse(logs[0][1]);
  assert.equal(record.lead_id, body.lead_id); assert.equal(record.message_sent, 'unconfirmed');
  assert.equal(record.attribution.last.params.gclid, 'test_gclid_123');
  assert.equal(record.conversion_page, '/contact');
  assert.ok(!logs[0][1].includes('private@example.com'));
  assert.ok(!record.cta_location.includes('<script>')); assert.ok(!/[\r\n]/.test(record.cta_location));
});
test('Receiver distrusts spoofed labels and tolerates malformed attribution', async () => {
  const body = recordBody(); body.attribution.last.source_label = 'Not Google Ads'; body.attribution.first.source = 'fake';
  let result = await captureReceiver(body);
  assert.equal(JSON.parse(result.logs[0][1]).source_label, 'Google Ads');
  body.attribution = { broken: true }; body.lead_id = w.generateLeadId();
  result = await captureReceiver(body);
  assert.equal(result.response.status, 200); assert.equal(JSON.parse(result.logs[0][1]).attribution.first, null);
});
test('Repeated references produce only one warm-instance diagnostic log', async () => {
  const body = recordBody();
  assert.equal((await captureReceiver(body)).logs.length, 1);
  assert.equal((await captureReceiver(body)).logs.length, 0);
});
test('Receiver rejects cross-origin, oversized requests and invalid references', async () => {
  assert.equal((await route.POST(request(recordBody(), { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await route.POST(request({ lead_id: '<script>' }))).status, 400);
  assert.equal((await route.POST(request({ data: 'x'.repeat(17000) }))).status, 413);
});
test('Click logging works without email credentials and does not claim durable storage', async () => {
  delete process.env.RESEND_API_KEY; delete process.env.ENQUIRY_FROM_EMAIL;
  const { response } = await captureReceiver(recordBody());
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.logged, true); assert.equal(result.recorded, undefined);
});
test('Blocked cookies/localStorage/sessionStorage leave consultation functional', () => {
  const { events } = browser();
  Object.defineProperty(document, 'cookie', { configurable: true, get() { throw new Error('blocked'); }, set() { throw new Error('blocked'); } });
  for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(globalThis, name, { configurable: true, value: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } } });
  const cleanup = tracking.installWhatsAppTracking(); const link = anchor();
  assert.doesNotThrow(() => click(link)); assert.ok(link.href.includes('Ref%3A')); assert.equal(events.length, 1); cleanup();
});
test('Real new-document Direct session preserves marketing touch while recording Direct session', () => {
  browser(); const first = a.getAttribution();
  window.history.pushState({}, '', '/contact');
  Object.defineProperty(window.performance, 'timeOrigin', { configurable: true, value: window.performance.timeOrigin + 100 });
  const next = a.getAttribution();
  assert.equal(next.session.source_label, 'Direct'); assert.deepEqual(next.first, first.first); assert.deepEqual(next.last, first.last);
});
test('Cookie access denied still persists through the independent localStorage fallback', () => {
  browser();
  Object.defineProperty(document, 'cookie', { configurable: true, get() { throw new Error('blocked'); }, set() { throw new Error('blocked'); } });
  const first = a.getAttribution();
  assert.ok(localStorage.getItem(a.ATTRIBUTION_KEY));
  window.history.pushState({}, '', '/zh/contact');
  assert.deepEqual(a.getAttribution().first, first.first);
});
