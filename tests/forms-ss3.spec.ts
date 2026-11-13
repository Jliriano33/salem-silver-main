import { test, expect, type Page } from '@playwright/test';

// SS-3 contract for the lead forms in the browser. Fake data only. Every request that is not to the local
// test servers is aborted, so Meta, nominatim and the rest never see it.
//   F-002: the quiz must not say "You're all set!" when the lead did not go through.
//   F-004: the seller's address, name, email and phone must never sit in a page URL, because Meta's script
//          sends the full page URL to its gateway. Inbound links that carry them still prefill the quiz.
const ECHO = 'http://127.0.0.1:3199';
const FAKE = { name: 'TEST SS3 Audit', phone: '6175550100', email: 'test-ss3@example.com' };
const ADDRESS = '1 Audit Test Way, Nowhere, MA';
const PII = [ADDRESS, encodeURIComponent(ADDRESS), FAKE.name, encodeURIComponent(FAKE.name), FAKE.email,
  encodeURIComponent(FAKE.email), FAKE.phone];
const PII_KEYS = ['address', 'n', 'e', 'p'];

const isLocal = (host: string) => host === '127.0.0.1' || host === 'localhost';

test.beforeEach(async ({ page, request }) => {
  expect((await request.post(`${ECHO}/reset`)).ok()).toBeTruthy();
  await page.context().route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return isLocal(host) ? route.continue() : route.abort();
  });
});

const pause = (page: Page, ms = 450) => page.waitForTimeout(ms);

/** Every URL the page shows, as main-frame navigations and history changes, plus the URL at 'load'. */
async function watchUrls(page: Page): Promise<() => Promise<string[]>> {
  const seen: string[] = [];
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(f.url()); });
  await page.addInitScript(() => {
    const w = window as unknown as { __urls: string[] };
    w.__urls = [];
    const record = () => w.__urls.push(location.href);
    for (const k of ['pushState', 'replaceState'] as const) {
      const orig = history[k].bind(history);
      history[k] = (...a: Parameters<History['pushState']>) => { orig(...a); record(); };
    }
    window.addEventListener('load', () => w.__urls.push('load:' + location.href));
  });
  return async () => {
    const inPage = await page.evaluate(() => (window as unknown as { __urls: string[] }).__urls).catch(() => []);
    return [...seen, ...inPage];
  };
}

/** Walks the quiz from the address step to step 11, with the phone filled in. */
async function reachQuizSubmit(page: Page, opts: { fillContact?: boolean } = { fillContact: true }) {
  const pane = page.locator('div.bg-white.rounded-2xl').first();
  const firstChoice = () => pane.locator('button').filter({ hasNotText: 'Back' }).first();
  await page.getByRole('button', { name: /Yes, that/ }).click();
  await pause(page);
  for (let i = 0; i < 4; i++) { await firstChoice().click(); await pause(page); }
  await page.locator('input[type=number]').fill('1800');
  await page.getByRole('button', { name: /Continue/ }).click();
  await pause(page);
  await firstChoice().click();
  await pause(page);
  await page.getByRole('button', { name: /Continue/ }).click();
  await pause(page);
  if (opts.fillContact) {
    await page.locator('input[placeholder="Enter your full name"]').fill(FAKE.name);
    await page.locator('input[type=email]').fill(FAKE.email);
  }
  await page.getByRole('button', { name: /Continue/ }).click();
  await pause(page);
  if (opts.fillContact) await page.locator('input[type=tel]').fill(FAKE.phone);
  await page.locator('#consent-quiz').check();
  return page.getByRole('button', { name: /Get My Cash Offer/ });
}

async function startQuizWithAddress(page: Page) {
  await page.goto('/');
  await page.getByLabel('Property address').fill(ADDRESS);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Get My Cash Offer/ }).first().click();
  await page.waitForURL(/\/cash-offer/);
  await expect(page.getByText(ADDRESS)).toBeVisible();
}

test.describe('F-002: the quiz tells the truth when the lead fails', () => {
  const failures = [
    { name: 'a 502 from /api/lead', fail: { status: 502, body: '{"success":false,"error":"Submission failed. Please call +1 617-714-2020."}' } },
    { name: 'a 400 from /api/lead', fail: { status: 400, body: '{"success":false,"error":"Please enter a valid phone number."}' } },
    { name: 'a network failure', fail: null },
  ];
  for (const f of failures) {
    test(`after ${f.name}: no success screen, an error with the phone line, and a retry that works`, async ({ page, request }) => {
      await startQuizWithAddress(page);
      const submit = await reachQuizSubmit(page);

      await page.route('**/api/lead', (route) =>
        f.fail ? route.fulfill({ status: f.fail.status, contentType: 'application/json', body: f.fail.body }) : route.abort('failed'));
      await submit.click();

      const alert = page.getByRole('alert').filter({ hasText: /617/ });
      await expect(alert).toBeVisible();
      await expect(alert.locator('a[href="tel:+16177142020"]')).toBeVisible();
      await expect(page.getByRole('heading', { name: /all set/i })).toHaveCount(0);
      // The answers are still there, so the seller does not start over.
      await expect(page.locator('input[type=tel]')).toHaveValue(FAKE.phone);
      expect(await (await request.get(`${ECHO}/all`)).json()).toHaveLength(0);

      await page.unroute('**/api/lead');
      await submit.click();
      await expect(page.getByRole('heading', { name: /all set/i })).toBeVisible();
      expect(await (await request.get(`${ECHO}/all`)).json()).toHaveLength(1);
    });
  }
});

test.describe('F-004: no seller details in page URLs', () => {
  test('home hero to quiz to done: the address never appears in a URL, and the quiz still has it', async ({ page }) => {
    const urls = await watchUrls(page);
    await startQuizWithAddress(page);
    const submit = await reachQuizSubmit(page);
    await submit.click();
    await expect(page.getByRole('heading', { name: /all set/i })).toBeVisible();

    const all = await urls();
    expect(all.length).toBeGreaterThan(1);
    for (const u of all) for (const v of PII) expect(u, `URL ${u}`).not.toContain(v);
  });

  test('an inbound link with ?address=&n=&e=&p= is cleaned before load, keeps UTMs, and still prefills', async ({ page }) => {
    const urls = await watchUrls(page);
    const q = new URLSearchParams({ address: ADDRESS, n: FAKE.name, e: FAKE.email, p: FAKE.phone, utm_source: 'ss3-test' });
    await page.goto(`/cash-offer?${q}`);
    await expect(page.getByText(ADDRESS)).toBeVisible();

    const loadUrl = (await urls()).find((u) => u.startsWith('load:'));
    expect(loadUrl, 'the URL at the load event').toBeDefined();
    const at = new URL(loadUrl!.slice(5));
    for (const k of PII_KEYS) expect(at.searchParams.has(k), `${k} at load`).toBe(false);
    expect(at.searchParams.get('utm_source')).toBe('ss3-test');
    const now = new URL(page.url());
    for (const k of PII_KEYS) expect(now.searchParams.has(k), `${k} now`).toBe(false);

    // The name, email and phone from the link are prefilled where the quiz asks for them.
    await reachQuizSubmit(page, { fillContact: false });
    await expect(page.locator('input[type=tel]')).toHaveValue(FAKE.phone);
    await page.getByRole('button', { name: /Back/ }).click();
    await expect(page.locator('input[placeholder="Enter your full name"]')).toHaveValue(FAKE.name);
    await expect(page.locator('input[type=email]')).toHaveValue(FAKE.email);
  });

  test('LP form to thank-you: the address is shown but never in the URL', async ({ page }) => {
    const urls = await watchUrls(page);
    const id = 'google-lp';
    await page.goto('/lp/google');
    await page.locator(`#lp-name-${id}`).fill(FAKE.name);
    await page.locator(`#lp-phone-${id}`).fill(FAKE.phone);
    await page.locator(`#lp-email-${id}`).fill(FAKE.email);
    await page.locator(`#lp-address-${id}`).fill(ADDRESS);
    await page.keyboard.press('Escape');
    await page.locator(`#lp-condition-${id}`).selectOption('Good');
    await page.locator(`#lp-timeline-${id}`).selectOption('Just Exploring');
    await page.locator(`#consent-${id}`).check();
    await page.locator(`#lp-name-${id}`).locator('xpath=ancestor::form[1]').locator('button[type=submit]').click();

    await page.waitForURL(/\/thank-you/);
    await expect(page.getByText(ADDRESS)).toBeVisible();
    for (const u of await urls()) for (const v of PII) expect(u, `URL ${u}`).not.toContain(v);
  });
});

test.describe('F-045: a honeypot field that people never see', () => {
  for (const path of ['/lp/google', '/lp/facebook']) {
    test(`${path} has a hidden honeypot that is out of the tab order`, async ({ page }) => {
      await page.goto(path);
      const hp = page.locator('input[name="website"]').first();
      await expect(hp).toHaveCount(1);
      await expect(hp).toBeHidden();
      await expect(hp).toHaveAttribute('tabindex', '-1');
      await expect(hp).toHaveAttribute('autocomplete', 'off');
    });
  }

  test('the quiz has the same hidden honeypot on its last step', async ({ page }) => {
    await startQuizWithAddress(page);
    await reachQuizSubmit(page);
    const hp = page.locator('input[name="website"]');
    await expect(hp).toHaveCount(1);
    await expect(hp).toBeHidden();
    await expect(hp).toHaveAttribute('tabindex', '-1');
  });
});
