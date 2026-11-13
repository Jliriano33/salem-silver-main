import { test, expect } from '@playwright/test';

// SS-3 contract for the legal pages and the claims Jefri ruled on (Nov 13 2026).
//   F-003: the privacy policy tells the truth about tracking and who handles the data.
//   F-019: it names only Salem Silver, never Liriano Realty.
//   F-016: /terms exists and the forms link to it. /privacy, a common guess, reaches the policy.
//   F-020: no license claim is shown. F-010: "thousands" and "hundreds" no longer contradict.
const PAGES = ['/', '/cash-offer', '/lp/google', '/lp/facebook', '/privacy-policy', '/terms', '/thank-you'];

test('the privacy policy names the real tracking and processors, and never Liriano', async ({ page }) => {
  await page.goto('/privacy-policy');
  const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  expect(text).not.toMatch(/liriano/i);
  expect(text).not.toMatch(/do not (currently )?use[^.]*Meta Pixel/i);
  for (const name of ['Meta Pixel', 'Conversions API', 'OpenStreetMap', 'GoHighLevel', 'Cloudflare', 'recorded']) {
    expect(text, `mentions ${name}`).toContain(name);
  }
  expect(text).toContain('Salem Silver Capital');
  expect(text).toContain('STOP');
  await expect(page.locator('a[href="/terms"]').first()).toBeVisible();
});

test('/terms loads, names only Salem Silver, and links back to the privacy policy', async ({ page }) => {
  const res = await page.goto('/terms');
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Terms of Service/);
  const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  expect(text).not.toMatch(/liriano/i);
  expect(text).toContain('Salem Silver Capital');
  await expect(page.locator('main a[href="/privacy-policy"]').first()).toBeVisible();
});

test('/privacy redirects to /privacy-policy', async ({ request }) => {
  const res = await request.get('/privacy', { maxRedirects: 0 });
  expect([301, 308]).toContain(res.status());
  expect(new URL(res.headers()['location'], 'http://x').pathname).toBe('/privacy-policy');
});

test('the footer links to both legal pages', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.locator('a[href="/privacy-policy"]')).toHaveCount(1);
  await expect(footer.locator('a[href="/terms"]')).toHaveCount(1);
});

for (const path of PAGES) {
  test(`${path}: no license claim and no "thousands of homeowners"`, async ({ page }) => {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toMatch(/Licensed\s*(&amp;|&|and)\s*Trusted/i);
    expect(html).not.toMatch(/Licensed & trusted/i);
    expect(html).not.toMatch(/thousands of homeowners/i);
  });
}

// Quiz steps 10 and 11 render only mid-quiz, so also search the built browser code for the claims.
test('the built browser code carries no license claim and no "thousands of homeowners"', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = path.resolve(__dirname, '..', '.next', 'static', 'chunks');
  const files: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (p.endsWith('.js')) files.push(p);
    }
  };
  walk(dir);
  expect(files.length).toBeGreaterThan(5);
  const hits = files.filter((f) => /Licensed (&|&amp;|and) [Tt]rusted|thousands of homeowners/.test(fs.readFileSync(f, 'utf8')));
  expect(hits.map((f) => path.basename(f))).toEqual([]);
});
