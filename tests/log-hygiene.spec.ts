import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { SERVER_LOG, WEBHOOK_URL } from './test-env';

// F-050: /api/lead must not write the webhook URL to the server log. On Cloudflare that log is the
// function log, and the URL is the only secret the intake has. Fake data only; the webhook is the
// local echo server.
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

const logSize = () => fs.statSync(SERVER_LOG).size;
// Slice by bytes: the size is in bytes and the log holds multi-byte characters.
const logSince = (offset: number) => fs.readFileSync(SERVER_LOG).subarray(offset).toString('utf8');

test('a forwarded lead does not put the webhook URL in the server log', async ({ request }) => {
  const before = logSize();
  const res = await request.post('/api/lead', { data: lead });
  expect(res.status()).toBe(200);

  // Prove the log is captured at all, so a missing or empty log cannot pass this test.
  await expect.poll(() => logSince(before)).toContain('[lead] n8n response: 200');

  const logged = logSince(before);
  expect(logged).not.toContain(WEBHOOK_URL);
  expect(logged).not.toContain(new URL(WEBHOOK_URL).pathname);
});
