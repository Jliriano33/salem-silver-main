import { test, expect, type APIRequestContext } from '@playwright/test';

// Contract for POST /api/lead consent capture (SS-2). Fake data only; the
// webhook target is the local echo server on 127.0.0.1:3199.
const ECHO = 'http://127.0.0.1:3199';
const VERSION = '2026-10-23-v1';

const base = {
  name: 'TEST SS2 Audit',
  phone: '6175550100',
  email: 'test-ss2@example.com',
  address: '1 Audit Test Way, Nowhere, MA',
  condition: 'Good',
  timeline: 'Just Exploring',
  source: 'google-lp',
};

type Hooked = Record<string, unknown>;

async function echoAll(request: APIRequestContext): Promise<Hooked[]> {
  const res = await request.get(`${ECHO}/all`);
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as Hooked[];
}

test.beforeEach(async ({ request }) => {
  const res = await request.post(`${ECHO}/reset`);
  expect(res.ok()).toBeTruthy();
});

test('rejects a lead with no consent key (400, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', { data: { ...base } });
  expect(res.status()).toBe(400);
  expect(await echoAll(request)).toHaveLength(0);
});

test('rejects consent: false (400, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', {
    data: { ...base, consent: false, consent_version: VERSION, source_page: '/lp/google' },
  });
  expect(res.status()).toBe(400);
  expect(await echoAll(request)).toHaveLength(0);
});

test('rejects consent: "true" as a string (400, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', {
    data: { ...base, consent: 'true', consent_version: VERSION, source_page: '/lp/google' },
  });
  expect(res.status()).toBe(400);
  expect(await echoAll(request)).toHaveLength(0);
});

test('accepts consent: true and forwards consent fields plus existing keys', async ({ request }) => {
  const res = await request.post('/api/lead', {
    data: { ...base, consent: true, consent_version: VERSION, source_page: '/lp/google' },
  });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ success: true });

  const all = await echoAll(request);
  expect(all.length).toBeGreaterThanOrEqual(1);
  const last = all[all.length - 1];

  expect(last.consent).toBe(true);
  expect(last.consent_version).toBe(VERSION);
  expect(last.source_page).toBe('/lp/google');

  expect(typeof last.consent_at).toBe('string');
  const at = last.consent_at as string;
  expect(at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/);
  const ms = Date.parse(at);
  expect(Number.isNaN(ms)).toBe(false);
  expect(Math.abs(Date.now() - ms)).toBeLessThan(2 * 60 * 1000);

  // Pre-existing payload keys must still be forwarded.
  expect(last.name).toBe(base.name);
  expect(last.phone).toBe(base.phone);
  expect(last.email).toBe(base.email);
  expect(last.address).toBe(base.address);
  expect(last.condition).toBe(base.condition);
  expect(last.timeline).toBe(base.timeline);
  expect(last.source).toBe(base.source);
  for (const key of [
    'unitNumber', 'homeValue', 'sellingReason', 'features', 'bedrooms',
    'bathrooms', 'lotSize', 'finishedSqft', 'garageSize', 'occupancy',
  ]) {
    expect(last, `forwarded body keeps "${key}"`).toHaveProperty(key);
  }
});

test('regression: a missing required field still returns 400 even with consent', async ({ request }) => {
  const { email: _omit, ...noEmail } = base;
  void _omit;
  const res = await request.post('/api/lead', {
    data: { ...noEmail, consent: true, consent_version: VERSION, source_page: '/lp/google' },
  });
  expect(res.status()).toBe(400);
  expect(await echoAll(request)).toHaveLength(0);
});
