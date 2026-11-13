import fs from 'node:fs';
import { test, expect, type APIRequestContext } from '@playwright/test';
import { INTAKE_HEADER, INTAKE_SECRET, LOCKED_SERVER, LOCKED_SERVER_LOG, MAIN_SERVER } from './test-env';

// SS-3 contract for POST /api/lead beyond consent: junk and bots are refused before anything reaches n8n
// (F-045), a hung webhook ends in a timeout (F-017), and the intake secret header is sent and never logged
// (F-044b). Fake data only; the webhook is the local echo server.
const ECHO = 'http://127.0.0.1:3199';
const valid = {
  name: 'TEST SS3 Audit',
  phone: '6175550100',
  email: 'test-ss3@example.com',
  address: '1 Audit Test Way, Nowhere, MA',
  condition: 'Good',
  timeline: 'Just Exploring',
  source: 'google-lp',
  consent: true,
  consent_version: '2026-10-23-v1',
  source_page: '/lp/google',
};

async function forwarded(request: APIRequestContext): Promise<unknown[]> {
  const res = await request.get(`${ECHO}/all`);
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as unknown[];
}

test.beforeEach(async ({ request }) => {
  expect((await request.post(`${ECHO}/reset`)).ok()).toBeTruthy();
});

test('the valid lead used below is forwarded (control)', async ({ request }) => {
  const res = await request.post('/api/lead', { data: valid });
  expect(res.status()).toBe(200);
  expect(await forwarded(request)).toHaveLength(1);
});

const refused: { name: string; body: Record<string, unknown>; status: number }[] = [
  { name: 'a phone with too few digits', body: { ...valid, phone: '55501' }, status: 400 },
  { name: 'a phone with too many digits', body: { ...valid, phone: '617555010012345' }, status: 400 },
  { name: 'a phone made of letters', body: { ...valid, phone: 'call me maybe!' }, status: 400 },
  { name: 'an email without a domain', body: { ...valid, email: 'test-ss3@' }, status: 400 },
  { name: 'an email with spaces', body: { ...valid, email: 'test ss3@example.com' }, status: 400 },
  { name: 'a 301-character address', body: { ...valid, address: 'A'.repeat(301) }, status: 400 },
  { name: 'a 121-character name', body: { ...valid, name: 'N'.repeat(121) }, status: 400 },
  { name: 'a 201-character optional field', body: { ...valid, condition: 'C'.repeat(201) }, status: 400 },
  { name: 'a non-string field', body: { ...valid, timeline: { nested: true } }, status: 400 },
];

for (const c of refused) {
  test(`refuses ${c.name} (${c.status}, nothing forwarded)`, async ({ request }) => {
    const res = await request.post('/api/lead', { data: c.body });
    expect(res.status()).toBe(c.status);
    expect((await res.json()).success).toBe(false);
    expect(await forwarded(request)).toHaveLength(0);
  });
}

test('refuses a body over 16 KB (413, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', { data: { ...valid, filler: 'x'.repeat(17_000) } });
  expect(res.status()).toBe(413);
  expect(await forwarded(request)).toHaveLength(0);
});

test('refuses a cross-site text/plain post (415, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', {
    headers: { 'Content-Type': 'text/plain' },
    data: JSON.stringify(valid),
  });
  expect(res.status()).toBe(415);
  expect(await forwarded(request)).toHaveLength(0);
});

test('refuses malformed JSON (400, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', {
    headers: { 'Content-Type': 'application/json' },
    data: '{"name": "TEST',
  });
  expect(res.status()).toBe(400);
  expect(await forwarded(request)).toHaveLength(0);
});

test('refuses a foreign Origin (403, nothing forwarded)', async ({ request }) => {
  const res = await request.post('/api/lead', { headers: { Origin: 'https://evil.example' }, data: valid });
  expect(res.status()).toBe(403);
  expect(await forwarded(request)).toHaveLength(0);
});

test('accepts its own origin and the production origins', async ({ request }) => {
  for (const origin of [MAIN_SERVER, 'https://www.salemsilver.com', 'https://salemsilver.com']) {
    const res = await request.post('/api/lead', { headers: { Origin: origin }, data: valid });
    expect(res.status(), origin).toBe(200);
  }
  expect(await forwarded(request)).toHaveLength(3);
});

test('drops a lead whose honeypot is filled: answers like success, forwards nothing', async ({ request }) => {
  const res = await request.post('/api/lead', { data: { ...valid, website: 'http://spam.example' } });
  expect(res.status()).toBe(200);
  expect((await res.json()).success).toBe(true);
  expect(await forwarded(request)).toHaveLength(0);
});

test('ends a webhook that never answers with a 504 inside the timeout', async ({ request }) => {
  expect((await request.post(`${ECHO}/mode`, { data: { next: 'hang' } })).ok()).toBeTruthy();
  const started = Date.now();
  const res = await request.post('/api/lead', { data: valid, timeout: 30_000 });
  const took = Date.now() - started;
  expect(res.status()).toBe(504);
  expect((await res.json()).error).toContain('617-714-2020');
  expect(took).toBeLessThan(20_000);
});

test('sends no intake header when no secret is configured', async ({ request }) => {
  expect((await request.post('/api/lead', { data: valid })).status()).toBe(200);
  const headers = (await (await request.get(`${ECHO}/headers`)).json()) as Record<string, string>[];
  expect(headers).toHaveLength(1);
  expect(headers[0][INTAKE_HEADER]).toBeUndefined();
});

test('sends the intake secret header when N8N_WEBHOOK_SECRET is set, and never logs it', async ({ request }) => {
  const before = fs.statSync(LOCKED_SERVER_LOG).size;
  const res = await request.post(`${LOCKED_SERVER}/api/lead`, { data: valid });
  expect(res.status()).toBe(200);
  const headers = (await (await request.get(`${ECHO}/headers`)).json()) as Record<string, string>[];
  expect(headers).toHaveLength(1);
  expect(headers[0][INTAKE_HEADER]).toBe(INTAKE_SECRET);

  const logged = () => fs.readFileSync(LOCKED_SERVER_LOG).subarray(before).toString('utf8');
  await expect.poll(logged).toContain('[lead] n8n response: 200');
  expect(logged()).not.toContain(INTAKE_SECRET);
});
