import http from 'node:http';
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { BAD_SERVER, BAD_SERVER_LOG, MAIN_SERVER, SERVER_LOG } from './test-env';

// SS-3 audit cycle 1 repairs (A1-01, A1-04, A1-05, A1-06, A1-07, A1-10, A1-11). A1-09 is in
// meta-url-ss3.spec.ts, which needs its own browser settings. Fake data only.
const ECHO = 'http://127.0.0.1:3199';
const FAKE = { name: 'TEST SS3 Audit', phone: '6175550100', email: 'test-ss3@example.com' };
const ADDRESS = '1 Audit Test Way, Nowhere, MA';
const OTHER = '9 Second Visitor Rd, Elsewhere, NH';
const valid = {
  name: FAKE.name, phone: FAKE.phone, email: FAKE.email, address: ADDRESS, condition: 'Good',
  timeline: 'Just Exploring', source: 'google-lp', consent: true, consent_version: '2026-10-23-v1',
  source_page: '/lp/google',
};
const isLocal = (host: string) => host === '127.0.0.1' || host === 'localhost';

test.beforeEach(async ({ request }) => {
  expect((await request.post(`${ECHO}/reset`)).ok()).toBeTruthy();
});

test.describe('in the browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().route('**/*', (route) =>
      isLocal(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  });

  test('A1-01: a second visitor in the same tab does not see the first one\'s address', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Property address').fill(ADDRESS);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Get My Cash Offer/ }).first().click();
    await page.waitForURL(/\/cash-offer/);
    await expect(page.getByText(ADDRESS)).toBeVisible();

    await page.goto('/cash-offer');
    await expect(page.getByRole('heading', { name: /correct address/ })).toBeVisible();
    await expect(page.getByText(ADDRESS)).toHaveCount(0);
    await expect(page.locator('input[placeholder="123 Main St, Salem, MA 01970"]')).toHaveValue('');
  });

  test('A1-01: an inbound link replaces earlier details instead of merging with them', async ({ page }) => {
    await page.goto(`/cash-offer?${new URLSearchParams({ address: ADDRESS, n: FAKE.name, e: FAKE.email, p: FAKE.phone })}`);
    await expect(page.getByText(ADDRESS)).toBeVisible();
    await page.goto(`/cash-offer?${new URLSearchParams({ address: OTHER })}`);
    await expect(page.getByText(OTHER)).toBeVisible();
    const stored = await page.evaluate(() => sessionStorage.getItem('ss_lead_prefill'));
    expect(stored ?? '').not.toContain(FAKE.email);
    expect(stored ?? '').not.toContain(FAKE.name);
  });

  test('A1-01: the thank-you page shows the address once, then forgets it', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((a) => sessionStorage.setItem('ss_lead_prefill', JSON.stringify({ address: a, at: Date.now() })), ADDRESS);
    await page.goto('/thank-you');
    await expect(page.getByText(ADDRESS)).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: /We Received Your Info/ })).toBeVisible();
    await expect(page.getByText(ADDRESS)).toHaveCount(0);
  });

  test('A1-04: other person fields and fragments that carry values are removed too; UTMs stay', async ({ page }) => {
    const q = new URLSearchParams({ email: FAKE.email, Phone: FAKE.phone, first_name: 'Test', utm_campaign: 'fall' });
    await page.goto(`/cash-offer?${q}#e=${encodeURIComponent(FAKE.email)}`);
    await expect(page.getByRole('heading', { name: /correct address/ })).toBeVisible();
    const u = new URL(page.url());
    expect(u.hash).toBe('');
    for (const k of ['email', 'Phone', 'first_name']) expect(u.searchParams.has(k), k).toBe(false);
    expect(u.searchParams.get('utm_campaign')).toBe('fall');
  });

  test('A1-11: every seller form links the terms', async ({ page }) => {
    for (const path of ['/lp/google', '/lp/facebook']) {
      await page.goto(path);
      await expect(page.locator('form a[href="/terms"]').first(), path).toBeVisible();
    }
  });
});

test.describe('the lead route', () => {
  test('A1-05/A1-10: a delivered lead is logged without the seller\'s details', async ({ request }) => {
    const before = fs.statSync(SERVER_LOG).size;
    expect((await request.post('/api/lead', { data: valid })).status()).toBe(200);
    const logged = () => fs.readFileSync(SERVER_LOG).subarray(before).toString('utf8');
    await expect.poll(logged).toContain('[lead] n8n response: 200');
    for (const v of [FAKE.email, FAKE.phone, ADDRESS, FAKE.name]) expect(logged()).not.toContain(v);
  });

  test('A1-05: a lead that n8n refused is logged in full, to recover it from', async ({ request }) => {
    expect((await request.post(`${ECHO}/mode`, { data: { next: 'n8n-404' } })).ok()).toBeTruthy();
    const before = fs.statSync(SERVER_LOG).size;
    expect((await request.post('/api/lead', { data: valid })).status()).toBe(502);
    const logged = () => fs.readFileSync(SERVER_LOG).subarray(before).toString('utf8');
    await expect.poll(logged).toContain('[lead] Not delivered (n8n answered 404), kept for recovery');
    expect(logged()).toContain(FAKE.email);
  });

  test('A1-07: a phone with letters around ten digits is refused', async ({ request }) => {
    for (const phone of ['abc6175550100xyz', '617-555-0100 ext. 9', 'tel:6175550100']) {
      const res = await request.post('/api/lead', { data: { ...valid, phone } });
      expect(res.status(), phone).toBe(400);
    }
    expect(await (await request.get(`${ECHO}/all`)).json()).toHaveLength(0);
  });

  test('A1-06: a chunked body over 16 KB with no Content-Length is refused', async ({ request }) => {
    const port = Number(new URL(MAIN_SERVER).port);
    const status = await new Promise<number>((resolve, reject) => {
      const req = http.request({ host: '127.0.0.1', port, path: '/api/lead', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' } }, (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      });
      req.on('error', reject);
      req.write(JSON.stringify({ ...valid, filler: '' }).slice(0, -2));
      for (let i = 0; i < 20; i++) req.write('x'.repeat(1024));
      req.end('"}');
    });
    expect(status).toBe(413);
    expect(await (await request.get(`${ECHO}/all`)).json()).toHaveLength(0);
  });
});

// Audit cycle 2 repairs (A1-01, A1-04, A1-11, A3-02, A3-03).
test.describe('cycle 2, in the browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().route('**/*', (route) =>
      isLocal(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  });

  async function walkToContact(page: import('@playwright/test').Page) {
    const pane = page.locator('div.bg-white.rounded-2xl').first();
    const firstChoice = () => pane.locator('button').filter({ hasNotText: 'Back' }).first();
    await page.getByRole('button', { name: /Yes, that/ }).click();
    await page.waitForTimeout(450);
    for (let i = 0; i < 4; i++) { await firstChoice().click(); await page.waitForTimeout(450); }
    await page.locator('input[type=number]').fill('1800');
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(450);
    await firstChoice().click();
    await page.waitForTimeout(450);
    await page.getByRole('button', { name: /Continue/ }).click();
    await page.waitForTimeout(450);
  }

  test('A1-01: an unread hand-off older than 30 minutes is ignored', async ({ page }) => {
    await page.goto('/');
    await page.evaluate((a) => sessionStorage.setItem('ss_lead_prefill',
      JSON.stringify({ address: a, at: Date.now() - 31 * 60 * 1000 })), ADDRESS);
    await page.goto('/cash-offer');
    await expect(page.getByRole('heading', { name: /correct address/ })).toBeVisible();
    await expect(page.getByText(ADDRESS)).toHaveCount(0);
  });

  test('A3-03: a second inbound link leaves no name or email from the first in the quiz', async ({ page }) => {
    await page.goto(`/cash-offer?${new URLSearchParams({ address: ADDRESS, n: FAKE.name, e: FAKE.email, p: FAKE.phone })}`);
    await expect(page.getByText(ADDRESS)).toBeVisible();
    await page.goto(`/cash-offer?${new URLSearchParams({ address: OTHER })}`);
    await expect(page.getByText(OTHER)).toBeVisible();
    await walkToContact(page);
    await expect(page.locator('input[placeholder="Enter your full name"]')).toHaveValue('');
    await expect(page.locator('input[type=email]')).toHaveValue('');
  });

  test('A1-04: renamed person fields, email or phone values, and fragments are removed; ad and click ids stay', async ({ page }) => {
    const q = new URLSearchParams({
      Address: ADDRESS, property_address: OTHER, contact: FAKE.email, ph: '617-555-0100',
      fbclid: 'IwAR3x_abc1234567890def', utm_content: '120211234567890123', utm_source: 'fb',
    });
    await page.goto(`/cash-offer?${q}#${FAKE.email}`);
    await expect(page.getByText(ADDRESS)).toBeVisible(); // Address, in any case, still prefills
    const u = new URL(page.url());
    expect(u.hash).toBe('');
    for (const k of ['Address', 'property_address', 'contact', 'ph']) expect(u.searchParams.has(k), k).toBe(false);
    expect(u.searchParams.get('fbclid')).toBe('IwAR3x_abc1234567890def');
    expect(u.searchParams.get('utm_content')).toBe('120211234567890123');
    expect(u.searchParams.get('utm_source')).toBe('fb');
  });

  test('A1-11: the quiz consent step links the terms', async ({ page }) => {
    await page.goto(`/cash-offer?${new URLSearchParams({ address: ADDRESS })}`);
    await walkToContact(page);
    await page.locator('input[placeholder="Enter your full name"]').fill(FAKE.name);
    await page.locator('input[type=email]').fill(FAKE.email);
    await page.getByRole('button', { name: /Continue/ }).click();
    const block = page.locator('#consent-quiz').locator('xpath=ancestor::div[2]');
    await expect(block.locator('a[href="/terms"]')).toBeVisible();
  });
});

// A3-02 is not testable here: under `next start` the Node server reads the whole request body before it calls
// an edge route, so the route cannot answer early on this machine. On Cloudflare the body streams to the
// route and readBodyLimited stops at 16 KB. Reported as NOT TESTED locally.

// Audit cycle 3 repairs (A5-01, A5-02, A5-03), authorized by Jefri on Nov 13 ("Sí, tercer ciclo").
test.describe('cycle 3', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().route('**/*', (route) =>
      isLocal(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  });

  for (const frag of ['#6175550100', '#(617)%20555-0100', '#+1-617-555-0100']) {
    test(`A5-01: a fragment that is only a phone number (${frag}) is removed`, async ({ page }) => {
      await page.goto(`/cash-offer${frag}`);
      await expect(page.getByRole('heading', { name: /correct address/ })).toBeVisible();
      expect(new URL(page.url()).hash).toBe('');
    });
  }

  test('A5-01: an ordinary page anchor stays', async ({ page }) => {
    await page.goto('/#how-it-works');
    await expect.poll(() => new URL(page.url()).hash).toBe('#how-it-works');
  });

  test('A5-02: 10-digit ids in UTMs and click ids stay; phone-shaped values elsewhere still go', async ({ page }) => {
    const q = new URLSearchParams({
      utm_content: '6175550100', utm_campaign: '12345678901', utm_term: '(617) 555-0100', gclid: '6175550100',
      fbclid: '61755501001', ph: '6175550100', utm_source: 'test-ss3@example.com',
    });
    await page.goto(`/cash-offer?${q}`);
    await expect(page.getByRole('heading', { name: /correct address/ })).toBeVisible();
    const u = new URL(page.url());
    expect(u.searchParams.get('utm_content')).toBe('6175550100');
    expect(u.searchParams.get('utm_campaign')).toBe('12345678901');
    expect(u.searchParams.get('utm_term')).toBe('(617) 555-0100');
    expect(u.searchParams.get('gclid')).toBe('6175550100');
    expect(u.searchParams.get('fbclid')).toBe('61755501001');
    expect(u.searchParams.has('ph'), 'ph').toBe(false);
    expect(u.searchParams.has('utm_source'), 'an email in a UTM still goes').toBe(false);
  });
});

test('A5-03: a request that failed without an answer is logged as delivery uncertain', async ({ request }) => {
  const before = fs.statSync(BAD_SERVER_LOG).size;
  expect((await request.post(`${BAD_SERVER}/api/lead`, { data: valid })).status()).toBe(500);
  const logged = () => fs.readFileSync(BAD_SERVER_LOG).subarray(before).toString('utf8');
  await expect.poll(logged).toContain('[lead] Delivery uncertain (request failed), kept for recovery');
  expect(logged()).not.toContain('Not delivered (request failed)');
});
