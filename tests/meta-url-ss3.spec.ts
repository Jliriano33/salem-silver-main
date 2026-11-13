import { test, expect, type Page } from '@playwright/test';
import { MAIN_SERVER } from './test-env';

const FAKE = { name: 'TEST SS3 Audit', phone: '6175550100', email: 'test-ss3@example.com' };
const ADDRESS = '1 Audit Test Way, Nowhere, MA';

// A1-09: the real pixel snippet runs only on salemsilver.com. This browser resolves www.salemsilver.com to the
// local test server, serves a stand-in for Meta's fbevents.js that records the page URL whenever it runs or is
// called, and aborts every other outside request. Nothing reaches Meta.
test.use({
  baseURL: 'http://www.salemsilver.com',
  launchOptions: { args: [`--host-resolver-rules=MAP www.salemsilver.com ${new URL(MAIN_SERVER).host}`] },
});

async function fakeMeta(page: Page) {
  await page.context().route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === 'connect.facebook.net' && u.pathname.endsWith('/fbevents.js')) {
      return route.fulfill({
        contentType: 'application/javascript',
        // A3-04: records what fbevents.js reads to build its requests: the page URL (dl), the referrer (rl)
        // and the arguments of each call.
        body: `(function(){var seen=window.__metaSaw=[];seen.push('load '+location.href+' ref '+document.referrer);
          var q=(window.fbq&&window.fbq.queue)||[];var call=function(){seen.push('call '+JSON.stringify([].slice.call(arguments))+' at '+location.href+' ref '+document.referrer);};
          q.forEach(function(a){call.apply(null,a);});window.fbq.callMethod=call;})();`,
      });
    }
    return u.hostname === 'www.salemsilver.com' ? route.continue() : route.abort();
  });
}

test.describe('as www.salemsilver.com, with a stand-in for Meta\'s script', () => {



  test('the stand-in really runs here (control)', async ({ page }) => {
    await fakeMeta(page);
    await page.goto('/lp/google');
    await expect.poll(() => page.evaluate(() => (window as unknown as { __metaSaw?: string[] }).__metaSaw?.length ?? 0))
      .toBeGreaterThan(0);
  });

  test('Meta\'s script never sees the address, name, email or phone from an inbound link', async ({ page }) => {
    await fakeMeta(page);
    const q = new URLSearchParams({ address: ADDRESS, n: FAKE.name, e: FAKE.email, p: FAKE.phone, utm_source: 'ss3' });
    await page.goto(`/cash-offer?${q}`);
    await expect(page.getByText(ADDRESS)).toBeVisible();
    const saw = await page.evaluate(() => (window as unknown as { __metaSaw?: string[] }).__metaSaw ?? []);
    expect(saw.length).toBeGreaterThan(0);
    for (const line of saw) {
      for (const v of [ADDRESS, encodeURIComponent(ADDRESS), FAKE.email, encodeURIComponent(FAKE.email), FAKE.phone,
        FAKE.name, encodeURIComponent(FAKE.name)]) {
        expect(line, line).not.toContain(v);
      }
    }
    expect(saw.join(' ')).toContain('utm_source=ss3');
  });
});

test('Meta\'s script never sees the address after the home page hands it to the quiz, nor in the referrer', async ({ page }) => {
  await fakeMeta(page);
  await page.goto('/');
  await page.getByLabel('Property address').fill(ADDRESS);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Get My Cash Offer/ }).first().click();
  await page.waitForURL(/\/cash-offer/);
  await expect(page.getByText(ADDRESS)).toBeVisible();
  const saw = await page.evaluate(() => (window as unknown as { __metaSaw?: string[] }).__metaSaw ?? []);
  expect(saw.length).toBeGreaterThan(0);
  for (const line of saw) for (const v of [ADDRESS, encodeURIComponent(ADDRESS)]) expect(line, line).not.toContain(v);
});
