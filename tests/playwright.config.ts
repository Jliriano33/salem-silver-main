import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { SERVER_LOG, WEBHOOK_URL } from './test-env';

// Run `npm run build` first. Then: npx playwright test -c tests/playwright.config.ts
const root = path.resolve(__dirname, '..');

export default defineConfig({
  testDir: '.',
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node tests/echo-server.mjs',
      cwd: root,
      url: 'http://127.0.0.1:3199/all',
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `npx next start -p 3100 -H 127.0.0.1 > "${SERVER_LOG}" 2>&1`,
      cwd: root,
      url: 'http://127.0.0.1:3100/lp/google',
      reuseExistingServer: false,
      timeout: 120_000,
      env: { N8N_WEBHOOK_URL: WEBHOOK_URL },
    },
  ],
});
