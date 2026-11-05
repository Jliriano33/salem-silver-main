import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { DEALS_SERVER_LOG } from './deals-env';

// Deal-page tests (goal NN). Run `npm run build` first, then:
//   npx playwright test -c tests/deals.playwright.config.ts
// The route talks to the local GHL mock on 3198, never to GoHighLevel. Ports 3110 and 3198 must be free.
const root = path.resolve(__dirname, '..');

export default defineConfig({
  testDir: '.',
  testMatch: /deals-.*\.spec\.ts/,
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3110' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node tests/deals-ghl-mock.mjs',
      cwd: root,
      url: 'http://127.0.0.1:3198/_calls',
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `npx next start -p 3110 -H 127.0.0.1 > "${DEALS_SERVER_LOG}" 2>&1`,
      cwd: root,
      url: 'http://127.0.0.1:3110/privacy-policy',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        GHL_DEALS_TOKEN: 'test-token-nn-9d2e',
        GHL_DEALS_LOCATION_ID: 'test-location-nn',
        GHL_DEALS_BASE_URL: 'http://127.0.0.1:3198',
      },
    },
  ],
});
