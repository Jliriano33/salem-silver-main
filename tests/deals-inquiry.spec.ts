import fs from 'node:fs';
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { DEALS_SERVER_LOG } from './deals-env';

// Deal-page investor inquiry (goal NN, AC8 and AC9 locally). Fake data only; the
// route's GHL target is the local mock on 127.0.0.1:3198.
const MOCK = 'http://127.0.0.1:3198';
const SLUG = '65-Woodland-St-Lawrence-MA';

const good = {
  slug: SLUG,
  firstName: 'TEST goal NN',
  lastName: 'Woodland',
  email: 'test-nn-woodland@example.com',
  phone: '(617) 555-0142',
  buyerType: 'cash',
  pofReady: 'yes',
  message: 'Can I see it Friday?',
  language: 'en',
  consent: true,
  consentVersion: 'investor-2026-11-06-v1',
  company: '',
};

type Call = { method: string; url: string; step: string | null; auth: string | null; version: string | null; body: any };
const calls = async (r: APIRequestContext): Promise<Call[]> => (await r.get(`${MOCK}/_calls`)).json();

test.beforeEach(async ({ request }) => {
  expect((await request.post(`${MOCK}/_reset`)).ok()).toBeTruthy();
});

test.describe('API', () => {
  test('delivers: upsert without tags, then tags, then a note', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: good });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const c = await calls(request);
    expect(c.map((x) => x.step)).toEqual(['upsert', 'tags', 'notes']);
    expect(c.map((x) => x.method)).toEqual(['POST', 'POST', 'POST']);
    expect(c.every((x) => x.auth === 'Bearer test-token-nn-9d2e' && x.version === '2021-07-28')).toBe(true);
    expect(c[0].body).toEqual({
      locationId: 'test-location-nn',
      firstName: 'TEST goal NN',
      lastName: 'Woodland',
      email: 'test-nn-woodland@example.com',
      phone: '+16175550142',
      source: 'Deal page 65 Woodland St',
    });
    expect(c[0].body).not.toHaveProperty('tags');
    expect(c[1].url).toBe('/contacts/mock-contact-1/tags');
    expect(c[1].body).toEqual({ tags: ['salem-silver-deal-page', 'salem-silver-investor', 'assignment-65-woodland-st', 'investor-english'] });
    expect(c[2].body.body).toContain('Buyer type: Cash');
    expect(c[2].body.body).toContain('Proof of funds ready: Yes');
    expect(c[2].body.body).toContain('Consent: yes (investor-2026-11-06-v1)');
    expect(c[2].body.body).toContain('Message: Can I see it Friday?');
  });

  test('a missing or different consent version is refused as a stale page, nothing sent', async ({ request }) => {
    for (const consentVersion of [undefined, 'made-up-v9', 'investor-2026-01-01-old']) {
      const res = await request.post('/api/deals/inquiry', { data: { ...good, consentVersion } });
      expect(res.status()).toBe(409);
      expect(await res.json()).toEqual({ ok: false, errors: ['stale_page'] });
    }
    expect(await calls(request)).toHaveLength(0);
  });

  test('Spanish locale gets the Spanish language tag', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: { ...good, language: 'es' } });
    expect(res.status()).toBe(200);
    const c = await calls(request);
    expect(c[1].body.tags).toContain('investor-spanish');
  });

  test('empty submission: every required field reported, nothing sent', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: { slug: SLUG } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.errors.sort()).toEqual(
      ['buyer_type', 'consent', 'email', 'first_name', 'last_name', 'phone', 'pof'].sort(),
    );
    expect(await calls(request)).toHaveLength(0);
  });

  test('invalid email and phone are rejected', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', {
      data: { ...good, email: 'not-an-email', phone: '555-01' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).errors.sort()).toEqual(['email', 'phone']);
    expect(await calls(request)).toHaveLength(0);
  });

  test('consent must be the boolean true', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: { ...good, consent: 'true' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).errors).toEqual(['consent']);
  });

  test('unknown deal is rejected', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: { ...good, slug: 'no-such-deal' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).errors).toEqual(['unknown_deal']);
    expect(await calls(request)).toHaveLength(0);
  });

  test('honeypot: silent ok, nothing sent', async ({ request }) => {
    const res = await request.post('/api/deals/inquiry', { data: { ...good, company: 'Acme' } });
    expect(res.status()).toBe(200);
    expect(await calls(request)).toHaveLength(0);
  });

  test('GHL failure at any step answers 502 delivery_failed', async ({ request }) => {
    for (const step of ['upsert', 'tags', 'notes']) {
      await request.post(`${MOCK}/_reset`);
      await request.post(`${MOCK}/_mode`, { data: { fail: step } });
      const res = await request.post('/api/deals/inquiry', { data: good });
      expect(res.status(), step).toBe(502);
      expect(await res.json()).toEqual({ ok: false, errors: ['delivery_failed'] });
    }
  });

  test('the server log never carries the token, email, phone or message', async ({ request }) => {
    await request.post('/api/deals/inquiry', { data: good });
    await request.post(`${MOCK}/_mode`, { data: { fail: 'tags' } });
    await request.post('/api/deals/inquiry', { data: good });
    await new Promise((r) => setTimeout(r, 300));
    const log = fs.readFileSync(DEALS_SERVER_LOG, 'utf8');
    for (const secret of ['test-token-nn-9d2e', 'test-nn-woodland@example.com', '5550142', '555-0142', 'Friday']) {
      expect(log, secret).not.toContain(secret);
    }
  });
});

test.describe('form UI', () => {
  const fill = async (page: Page) => {
    await page.getByLabel(/first name|nombre/i).fill('TEST goal NN');
    await page.getByLabel(/last name|apellido/i).fill('Woodland');
    await page.locator('#inv-email').fill('test-nn-woodland@example.com');
    await page.locator('#inv-phone').fill('6175550142');
    await page.locator('input[name=buyerType][value=hard_money]').check();
    await page.locator('input[name=pofReady][value=no]').check();
    await page.locator('#inv-message').fill('Typed message stays');
    await page.locator('input[name=consent]').check();
  };

  test('EN: empty submit shows errors, sends nothing', async ({ page, request }) => {
    await page.goto(`/deals/${SLUG}`);
    await page.getByTestId('investor-form').getByRole('button').click();
    const box = page.getByTestId('inquiry-errors');
    await expect(box).toBeVisible();
    await expect(box).toContainText(/email/i);
    expect(await calls(request)).toHaveLength(0);
  });

  test('ES: errors are in Spanish', async ({ page }) => {
    await page.goto(`/es/deals/${SLUG}`);
    await page.locator('#inv-email').fill('malo');
    await page.getByTestId('investor-form').getByRole('button').click();
    await expect(page.getByTestId('inquiry-errors')).toContainText(/correo/i);
  });

  test('API failure: error shown, typed data kept', async ({ page, request }) => {
    await request.post(`${MOCK}/_mode`, { data: { fail: 'upsert' } });
    await page.goto(`/deals/${SLUG}`);
    await fill(page);
    await page.getByTestId('investor-form').getByRole('button').click();
    await expect(page.getByTestId('inquiry-errors')).toBeVisible();
    await expect(page.locator('#inv-email')).toHaveValue('test-nn-woodland@example.com');
    await expect(page.locator('#inv-message')).toHaveValue('Typed message stays');
    await expect(page.locator('input[name=consent]')).toBeChecked();
  });

  test('success shows the thank-you state and delivers once', async ({ page, request }) => {
    await page.goto(`/es/deals/${SLUG}`);
    await fill(page);
    await page.getByTestId('investor-form').getByRole('button').click();
    await expect(page.getByTestId('inquiry-thanks')).toBeVisible();
    const c = await calls(request);
    expect(c.map((x) => x.step)).toEqual(['upsert', 'tags', 'notes']);
    expect(c[1].body.tags).toContain('investor-spanish');
    expect(c[2].body.body).toContain('Buyer type: Hard money');
  });
});

test.describe('deal URL', () => {
  test('the exact slug answers 200 and another case redirects to it', async ({ request }) => {
    expect((await request.get(`/deals/${SLUG}`)).status()).toBe(200);
    for (const asked of ['/deals/65-woodland-st-lawrence-ma', '/es/deals/65-WOODLAND-ST-LAWRENCE-MA']) {
      const res = await request.get(asked, { maxRedirects: 0 });
      expect(res.status(), asked).toBe(308);
      expect(res.headers()['location']).toContain(asked.startsWith('/es') ? `/es/deals/${SLUG}` : `/deals/${SLUG}`);
    }
    expect((await request.get('/deals/no-such-deal', { maxRedirects: 0 })).status()).toBe(404);
  });
});
