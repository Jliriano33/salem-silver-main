import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import {
  BAD_SERVER, BAD_SERVER_LOG, BAD_WEBHOOK_URL, INTAKE_SECRET, LOCKED_SERVER, LOCKED_SERVER_LOG, MAIN_SERVER,
  SERVER_LOG, WEBHOOK_URL,
} from './test-env';

// Run `npm run build` first. Then: npx playwright test -c tests/playwright.config.ts
const root = path.resolve(__dirname, '..');

export default defineConfig({
  testDir: '.',
  // Deal-page specs have their own config and servers (deals.playwright.config.ts).
  testIgnore: /deals-.*\.spec\.ts/,
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: MAIN_SERVER,
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
      command: `npx next start -p ${new URL(MAIN_SERVER).port} -H 127.0.0.1 > "${SERVER_LOG}" 2>&1`,
      cwd: root,
      url: `${MAIN_SERVER}/lp/google`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { N8N_WEBHOOK_URL: WEBHOOK_URL },
    },
    {
      command: `npx next start -p ${new URL(BAD_SERVER).port} -H 127.0.0.1 > "${BAD_SERVER_LOG}" 2>&1`,
      cwd: root,
      url: `${BAD_SERVER}/lp/google`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { N8N_WEBHOOK_URL: BAD_WEBHOOK_URL },
    },
    {
      command: `npx next start -p ${new URL(LOCKED_SERVER).port} -H 127.0.0.1 > "${LOCKED_SERVER_LOG}" 2>&1`,
      cwd: root,
      url: `${LOCKED_SERVER}/lp/google`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { N8N_WEBHOOK_URL: WEBHOOK_URL, N8N_WEBHOOK_SECRET: INTAKE_SECRET },
    },
  ],
});
