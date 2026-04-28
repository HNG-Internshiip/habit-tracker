// ── playwright.config.ts ─────────────────────────────────────────────────────
// NOTE: Playwright does not support Android/Termux.
// Run E2E tests from a desktop machine or CI (GitHub Actions, etc).
// The config below is correct for that environment.

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});