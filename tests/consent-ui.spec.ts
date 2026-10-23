import { test, expect, type Page, type Locator, type Request } from '@playwright/test';
import { EXPECTED_ERROR, EXPECTED_TEXT, EXPECTED_VERSION, REQUIRED_PHRASES } from './expected-consent';

// Contract for the consent checkbox on the three lead forms (SS-2).
// Fake data only. Every request that is not to the local test servers is
// aborted (Meta pixel, AWS/Cloud Run endpoints, Cloudflare insights,
// nominatim, Google Maps iframe), so no third-party traffic happens.
const ECHO = 'http://127.0.0.1:3199';
const FAKE = { name: 'TEST SS2 Audit', phone: '6175550100', email: 'test-ss2@example.com' };
const QUIZ_ADDRESS = '1 Audit Test Way, Nowhere, MA';
// The quiz address carries a unit, so step 2 runs and unitNumber is non-empty.
const QUIZ_UNIT_ADDRESS = '1 Audit Test Way, Unit 2B, Nowhere, MA';

type FormCase = { formId: 'google-lp' | 'facebook-lp' | 'quiz'; path: string };
const FORMS: FormCase[] = [
  { formId: 'google-lp', path: '/lp/google' },
  { formId: 'facebook-lp', path: '/lp/facebook' },
  { formId: 'quiz', path: '/cash-offer' },
];

// The request body each form sent before SS-2 (e1f6cab), plus the three consent keys.
const LP_KEYS = ['name', 'phone', 'email', 'address', 'condition', 'timeline', 'source'];
const QUIZ_KEYS = [
  'name', 'phone', 'email', 'address', 'unitNumber', 'condition', 'timeline', 'homeValue',
  'sellingReason', 'features', 'bedrooms', 'bathrooms', 'lotSize', 'finishedSqft', 'garageSize',
  'occupancy', 'source',
];
const CONSENT_KEYS = ['consent', 'consent_version', 'source_page'];

// The exact request each form must send for the fake data below (first choice at every quiz step,
// unit 2B, 1800 sq ft, the Pool feature), written out independently of the components.
function expectedRequest(form: FormCase): Record<string, unknown> {
  const consent = { consent: true, consent_version: EXPECTED_VERSION, source_page: form.path };
  if (form.formId === 'quiz') {
    return {
      name: FAKE.name, phone: FAKE.phone, email: FAKE.email, address: QUIZ_UNIT_ADDRESS, unitNumber: '2B',
      condition: 'Excellent', timeline: 'As Soon As Possible', homeValue: '$300K or less',
      sellingReason: 'Looking to buy a home', features: 'Pool', bedrooms: '3', bathrooms: '2',
      lotSize: '0.5_acres_or_less', finishedSqft: '1800', garageSize: 'none', occupancy: 'owner_occupied',
      source: 'cash-offer-quiz', ...consent,
    };
  }
  return {
    name: FAKE.name, phone: FAKE.phone, email: FAKE.email, address: QUIZ_ADDRESS,
    condition: 'Good', timeline: 'Just Exploring', source: form.formId, ...consent,
  };
}

// What /api/lead forwards: every key of its fixed payload, '' where the form sent nothing.
const FORWARDED_KEYS = [
  'name', 'phone', 'email', 'address', 'unitNumber', 'condition', 'timeline', 'homeValue', 'sellingReason',
  'features', 'bedrooms', 'bathrooms', 'lotSize', 'finishedSqft', 'garageSize', 'occupancy', 'source',
  'consent', 'consent_version', 'source_page',
];

/** True when a computed box-shadow draws at least one non-transparent ring with spread >= 1px. */
function hasVisibleRing(shadow: string): boolean {
  if (!shadow || shadow === 'none') return false;
  const parts = shadow.split(/,(?![^(]*\))/).map((p) => p.trim());
  return parts.some((part) => {
    const color = part.match(/rgba?\(([^)]*)\)/);
    const alpha = color ? Number((color[1].split(',')[3] ?? '1').trim()) : 1;
    const lengths = part.replace(/rgba?\([^)]*\)/, '').trim().split(/\s+/).map((v) => parseFloat(v));
    const spread = lengths.length >= 4 ? lengths[3] : 0;
    return alpha > 0 && spread >= 1;
  });
}

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
async function reachSubmit(page: Page, form: FormCase, opts: { skipEmail?: boolean } = {}): Promise<Locator> {
  if (form.formId === 'quiz') {
    await page.goto(`/cash-offer?address=${encodeURIComponent(QUIZ_UNIT_ADDRESS)}`);
    const pane = page.locator('div.bg-white.rounded-2xl').first();
    const firstChoice = () => pane.locator('button').filter({ hasNotText: 'Back' }).first();

    await page.getByRole('button', { name: /Yes, that/ }).click();
    await pause(page);
    await expect(page.locator('input[placeholder="Enter unit number"]')).toHaveValue('2B');
    await pane.getByRole('button', { name: /Continue/ }).click(); // step 2, unit confirmed
    await pause(page);
    for (let i = 0; i < 4; i++) {
      await firstChoice().click();
      await pause(page);
    }
    await page.locator('input[type=number]').fill('1800'); // step 7, finished square feet
    await page.getByRole('button', { name: /Continue/ }).click();
    await pause(page);
    await firstChoice().click();
    await pause(page);
    await pane.getByRole('button', { name: /Pool/ }).click(); // step 9, one feature
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
  if (!opts.skipEmail) await page.locator(`#lp-email-${id}`).fill(FAKE.email);
  await page.locator(`#lp-address-${id}`).fill(QUIZ_ADDRESS);
  await page.keyboard.press('Escape');
  await page.locator(`#lp-condition-${id}`).selectOption('Good');
  await page.locator(`#lp-timeline-${id}`).selectOption('Just Exploring');
  return page.locator(`#lp-name-${id}`).locator('xpath=ancestor::form[1]').locator('button[type=submit]');
}

/** The control right before the consent box in tab order on each form. */
const previousField = (page: Page, form: FormCase) =>
  form.formId === 'quiz' ? page.locator('input[type=tel]') : page.locator(`#lp-timeline-${form.formId}`);

for (const form of FORMS) {
  test.describe(`${form.path} (${form.formId})`, () => {
    test('renders an unchecked, visible consent checkbox with the exact text and a privacy link', async ({ page }) => {
      await reachSubmit(page, form);

      const box = page.locator(`#consent-${form.formId}`);
      await expect(box).toHaveCount(1);
      await expect(box).toHaveAttribute('type', 'checkbox');
      await expect(box).toHaveAttribute('name', 'consent');
      await expect(box).toBeVisible();
      await expect(box).not.toBeChecked();

      const label = page.locator(`label[for="consent-${form.formId}"]`);
      await expect(label).toHaveCount(1);
      await expect(label).toBeVisible();
      await expect(label).toHaveText(EXPECTED_TEXT);
      const rendered = (await label.textContent()) ?? '';
      for (const phrase of REQUIRED_PHRASES) {
        expect(rendered, `consent wording keeps "${phrase}"`).toContain(phrase);
      }

      // The checkbox's accessible name is the consent text.
      await expect(page.getByRole('checkbox', { name: EXPECTED_TEXT })).toHaveCount(1);

      // Consent block = nearest ancestor of the checkbox that also holds its label.
      const block = box.locator(
        `xpath=ancestor::*[descendant-or-self::label[@for="consent-${form.formId}"]][1]`
      );
      await expect(block).toHaveCount(1);
      await expect(block.locator('a[href="/privacy-policy"]').first()).toBeVisible();
    });

    test('is reachable and operable by keyboard, with a visible focus ring, and by its label', async ({ page }) => {
      await reachSubmit(page, form);
      const box = page.locator(`#consent-${form.formId}`);

      await previousField(page, form).focus();
      await page.keyboard.press('Tab');
      await expect(box).toBeFocused();
      const ring = await box.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(hasVisibleRing(ring), `visible focus ring on the checkbox (box-shadow: ${ring})`).toBe(true);
      // Negative control: with the ring suppressed, the same check must fail.
      const suppressed = await box.evaluate((el) => {
        (el as HTMLElement).style.setProperty('box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px', 'important');
        const v = getComputedStyle(el).boxShadow;
        (el as HTMLElement).style.removeProperty('box-shadow');
        return v;
      });
      expect(hasVisibleRing(suppressed), 'suppressed ring must not count as visible').toBe(false);

      await page.keyboard.press('Space');
      await expect(box).toBeChecked();
      await page.keyboard.press('Space');
      await expect(box).not.toBeChecked();

      await page.locator(`label[for="consent-${form.formId}"]`).click();
      await expect(box).toBeChecked();
    });

    test('blocks submit while unchecked, then sends exactly one complete consented lead', async ({ page, request }) => {
      const leadRequests: Request[] = [];
      page.on('request', (r) => { if (isLeadPost(r)) leadRequests.push(r); });

      const submit = await reachSubmit(page, form);
      const box = page.locator(`#consent-${form.formId}`);
      await expect(box).not.toBeChecked();

      // Unchecked: no request, the consent error is announced and tied to the box.
      await submit.click();
      await expect(page.locator('[role="alert"]', { hasText: EXPECTED_ERROR }).first()).toBeVisible();
      await expect(box).toHaveAttribute('aria-invalid', 'true');
      const describedBy = await box.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      await expect(page.locator(`[id="${describedBy}"]`)).toContainText(EXPECTED_ERROR);
      await pause(page, 1000);
      expect(leadRequests).toHaveLength(0);

      // Checked: exactly one request carrying consent and every pre-existing field.
      await box.check();
      const sent = page.waitForRequest(isLeadPost);
      await submit.click();
      const req = await sent;
      await req.response();
      await pause(page, 1500);
      expect(leadRequests).toHaveLength(1);

      const body = req.postDataJSON() as Record<string, unknown>;
      const keys = [...(form.formId === 'quiz' ? QUIZ_KEYS : LP_KEYS), ...CONSENT_KEYS].sort();
      expect(Object.keys(body).sort()).toEqual(keys);
      expect(body).toEqual(expectedRequest(form));
      expect(body.consent).toBe(true);
      expect(body.consent_version).toBe(EXPECTED_VERSION);
      expect(body.source_page).toBe(form.path);
      expect(body.name).toBe(FAKE.name);
      expect(body.email).toBe(FAKE.email);
      expect(body.address).toBe(expectedRequest(form).address);
      if (form.formId === 'quiz') {
        expect(body.phone).toBe(FAKE.phone);
        expect(body.source).toBe('cash-offer-quiz');
        expect(body.bedrooms).toBe('3');
        expect(body.bathrooms).toBe('2');
        expect(body.lotSize).toBe('0.5_acres_or_less');
        expect(body.garageSize).toBe('none');
      } else {
        expect(body.phone).toBe(FAKE.phone);
        expect(body.source).toBe(form.formId);
        expect(body.condition).toBe('Good');
        expect(body.timeline).toBe('Just Exploring');
      }

      // The API forwarded every value unchanged, with a server-side consent_at.
      let forwarded: Record<string, unknown>[] = [];
      await expect
        .poll(async () => {
          forwarded = (await (await request.get(`${ECHO}/all`)).json()) as Record<string, unknown>[];
          return forwarded.length;
        }, { timeout: 10_000 })
        .toBe(1);
      const sentBody = expectedRequest(form);
      const hooked = forwarded[0];
      for (const key of FORWARDED_KEYS) {
        const want = key === 'consent' ? true : (sentBody[key] ?? '');
        expect(hooked[key], `forwarded ${key}`).toEqual(want);
      }
      expect(typeof hooked.consent_at).toBe('string');
      expect(Math.abs(Date.now() - Date.parse(hooked.consent_at as string))).toBeLessThan(2 * 60 * 1000);
    });

    if (form.formId !== 'quiz') {
      test('shows the consent error together with a field error on the first try', async ({ page }) => {
        const leadRequests: Request[] = [];
        page.on('request', (r) => { if (isLeadPost(r)) leadRequests.push(r); });
        const submit = await reachSubmit(page, form, { skipEmail: true });
        await submit.click();
        const alert = page.locator('[role="alert"]', { hasText: EXPECTED_ERROR }).first();
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Please enter a valid email address.');
        await pause(page, 500);
        expect(leadRequests).toHaveLength(0);
      });
    }
  });
}
