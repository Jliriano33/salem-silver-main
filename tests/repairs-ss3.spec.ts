import http from 'node:http';
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { MAIN_SERVER, SERVER_LOG } from './test-env';

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
    await page.evaluate((a) => sessionStorage.setItem('ss_lead_prefill', JSON.stringify({ address: a })), ADDRESS);
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
    await expect.poll(logged).toContain('[lead] Not delivered, kept for recovery');
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
