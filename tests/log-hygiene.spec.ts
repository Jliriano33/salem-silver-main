import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { BAD_SERVER, BAD_SERVER_LOG, SECRET_MARK, SERVER_LOG, WEBHOOK_URL } from './test-env';

// F-050: /api/lead must not write the webhook URL, or any part of its path, to the server log. On
// Cloudflare that log is the function log, and the path is the only secret the intake has. Fake data
// only; the webhook is the local echo server.
const ECHO = 'http://127.0.0.1:3199';
const lead = {
  name: 'TEST SS2 Audit',
  phone: '6175550100',
  email: 'test-ss2@example.com',
  address: '1 Audit Test Way, Nowhere, MA',
  source: 'google-lp',
  consent: true,
  consent_version: '2026-10-23-v1',
  source_page: '/lp/google',
};

const logSize = (file: string) => fs.statSync(file).size;
// Slice by bytes: the size is in bytes and the log holds multi-byte characters.
const logSince = (file: string, offset: number) => fs.readFileSync(file).subarray(offset).toString('utf8');

function expectNoSecret(logged: string) {
  expect(logged).not.toContain(WEBHOOK_URL);
  expect(logged).not.toContain(SECRET_MARK);
}

test.beforeEach(async ({ request }) => {
  expect((await request.post(`${ECHO}/reset`)).ok()).toBeTruthy();
});

test('a forwarded lead does not put the webhook URL in the server log', async ({ request }) => {
  const before = logSize(SERVER_LOG);
  const res = await request.post('/api/lead', { data: lead });
  expect(res.status()).toBe(200);

  // Prove the log is captured at all, so a missing or empty log cannot pass this test.
  await expect.poll(() => logSince(SERVER_LOG, before)).toContain('[lead] n8n response: 200');
  expectNoSecret(logSince(SERVER_LOG, before));
});

test('an n8n "not registered" 404, which repeats the path, does not reach the server log', async ({ request }) => {
  expect((await request.post(`${ECHO}/mode`, { data: { next: 'n8n-404' } })).ok()).toBeTruthy();
  const before = logSize(SERVER_LOG);
  const res = await request.post('/api/lead', { data: lead });
  expect(res.status()).toBe(502);

  await expect.poll(() => logSince(SERVER_LOG, before)).toContain('[lead] n8n response: 404');
  expectNoSecret(logSince(SERVER_LOG, before));
});

test('a thrown fetch error that carries the URL does not reach the server log', async ({ request }) => {
  const before = logSize(BAD_SERVER_LOG);
  const res = await request.post(`${BAD_SERVER}/api/lead`, { data: lead });
  expect(res.status()).toBe(500);

  await expect.poll(() => logSince(BAD_SERVER_LOG, before)).toContain('[lead] Unexpected error');
  expectNoSecret(logSince(BAD_SERVER_LOG, before));
});
