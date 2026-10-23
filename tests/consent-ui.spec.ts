import { test, expect, type Page, type Locator, type Request } from '@playwright/test';
import { CONSENT_TEXT, CONSENT_VERSION } from '../lib/consent';

// Contract for the consent checkbox on the three lead forms (SS-2).
// Fake data only. Every request that is not to the local test servers is
// aborted (Meta pixel, AWS/Cloud Run endpoints, Cloudflare insights,
// nominatim, Google Maps iframe), so no third-party traffic happens.
const ECHO = 'http://127.0.0.1:3199';
const ERROR_TEXT = 'Please check the box to agree to be contacted.';
const FAKE = { name: 'TEST SS2 Audit', phone: '6175550100', email: 'test-ss2@example.com' };
const QUIZ_ADDRESS = '1 Audit Test Way, Nowhere, MA';

type FormCase = { formId: 'google-lp' | 'facebook-lp' | 'quiz'; path: string };
const FORMS: FormCase[] = [
  { formId: 'google-lp', path: '/lp/google' },
  { formId: 'facebook-lp', path: '/lp/facebook' },
  { formId: 'quiz', path: '/cash-offer' },
];

const BLOCKED = [
  /(^|\.)facebook\.com$/,
  /(^|\.)facebook\.net$/,
  /\.on\.aws$/,
  /\.cloud\.run$/,
  /(^|\.)cloudflareinsights\.com$/,
  /(^|\.)nominatim\.openstreetmap\.org$/,
];

const isLocal = (host: string) => host === '127.0.0.1' || host === 'localhost';
const isLeadPost = (r: Request) => r.method() === 'POST' && new URL(r.url()).pathname === '/api/lead';

test.beforeEach(async ({ page, request }) => {
  const reset = await request.post(`${ECHO}/reset`);
  expect(reset.ok()).toBeTruthy();

  await page.context().route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    if (BLOCKED.some((re) => re.test(host)) || !isLocal(host)) return route.abort();
    return route.continue();
  });
});

const pause = (page: Page, ms = 450) => page.waitForTimeout(ms);

/** Fills the form with fake data and returns its submit button (not clicked). */
async function reachSubmit(page: Page, form: FormCase): Promise<Locator> {
  if (form.formId === 'quiz') {
    await page.goto(`/cash-offer?address=${encodeURIComponent(QUIZ_ADDRESS)}`);
    const pane = page.locator('div.bg-white.rounded-2xl').first();
    const firstChoice = () => pane.locator('button').filter({ hasNotText: 'Back' }).first();

    await page.getByRole('button', { name: /Yes, that/ }).click();
    await pause(page);
    for (let i = 0; i < 4; i++) {
      await firstChoice().click();
      await pause(page);
    }
    await page.getByRole('button', { name: /Continue/ }).click();
    await pause(page);
    await firstChoice().click();
    await pause(page);
    await page.getByRole('button', { name: /Continue/ }).click();
    await pause(page);
    await page.locator('input[placeholder="Enter your full name"]').fill(FAKE.name);
    await page.locator('input[type=email]').fill(FAKE.email);
    await page.getByRole('button', { name: /Continue/ }).click();
    await pause(page);
    await page.locator('input[type=tel]').fill(FAKE.phone);
    return page.getByRole('button', { name: /Get My Cash Offer/ });
  }

  const id = form.formId;
  await page.goto(form.path);
  await page.locator(`#lp-name-${id}`).fill(FAKE.name);
  await page.locator(`#lp-phone-${id}`).fill(FAKE.phone);
  await page.locator(`#lp-email-${id}`).fill(FAKE.email);
  await page.locator(`#lp-address-${id}`).fill(QUIZ_ADDRESS);
  await page.keyboard.press('Escape');
  await page.locator(`#lp-condition-${id}`).selectOption('Good');
  await page.locator(`#lp-timeline-${id}`).selectOption('Just Exploring');
  return page.locator(`#lp-name-${id}`).locator('xpath=ancestor::form[1]').locator('button[type=submit]');
}

for (const form of FORMS) {
  test.describe(`${form.path} (${form.formId})`, () => {
    test('renders an unchecked consent checkbox with the consent text and a privacy link', async ({ page }) => {
      await reachSubmit(page, form);

      const box = page.locator(`#consent-${form.formId}`);
      await expect(box).toHaveCount(1);
      await expect(box).toHaveAttribute('type', 'checkbox');
      await expect(box).toHaveAttribute('name', 'consent');
      await expect(box).not.toBeChecked();

      const label = page.locator(`label[for="consent-${form.formId}"]`);
      await expect(label).toHaveCount(1);
      await expect(label).toContainText(CONSENT_TEXT);

      // Consent block = nearest ancestor of the checkbox that also holds its label.
      const block = box.locator(
        `xpath=ancestor::*[descendant-or-self::label[@for="consent-${form.formId}"]][1]`
      );
      await expect(block).toHaveCount(1);
      await expect(block.locator('a[href="/privacy-policy"]').first()).toBeAttached();
    });

    test('blocks submit while unchecked, then sends exactly one consented lead', async ({ page, request }) => {
      const leadRequests: Request[] = [];
      page.on('request', (r) => { if (isLeadPost(r)) leadRequests.push(r); });

      const submit = await reachSubmit(page, form);
      const box = page.locator(`#consent-${form.formId}`);
      await expect(box).toHaveCount(1);
      await expect(box).not.toBeChecked();

      // Unchecked: no request, visible error.
      await submit.click();
      await expect(page.locator('[role="alert"]', { hasText: ERROR_TEXT }).first()).toBeVisible();
      await pause(page, 1000);
      expect(leadRequests).toHaveLength(0);

      // Checked: exactly one request carrying consent.
      await box.check();
      await expect(box).toBeChecked();
      const sent = page.waitForRequest(isLeadPost);
      await submit.click();
      const req = await sent;
      await req.response();
      await pause(page, 1500);
      expect(leadRequests).toHaveLength(1);

      const body = req.postDataJSON() as Record<string, unknown>;
      expect(body.consent).toBe(true);
      expect(body.consent_version).toBe(CONSENT_VERSION);
      expect(body.source_page).toBe(form.path);

      // The API forwarded it to the (local) webhook with consent intact.
      await expect
        .poll(async () => {
          const res = await request.get(`${ECHO}/all`);
          const all = (await res.json()) as Record<string, unknown>[];
          return all.some((b) => b.consent === true && b.consent_version === CONSENT_VERSION);
        }, { timeout: 10_000 })
        .toBe(true);
    });
  });
}
