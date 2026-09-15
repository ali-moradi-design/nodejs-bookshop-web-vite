import { defineConfig, devices } from '@playwright/test';

/**
 * Default to system Chrome (`channel: 'chrome'`) so e2e works without
 * downloading Playwright's Chromium build — cdn.playwright.dev is geo-blocked
 * in some regions (HTTP 403 AccessDenied).
 *
 * Override: PLAYWRIGHT_CHANNEL=msedge  (Windows Edge)
 * Bundled Chromium (needs download): PLAYWRIGHT_CHANNEL=  empty + playwright install
 */
const channel = process.env.PLAYWRIGHT_CHANNEL || 'chrome';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    channel,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
