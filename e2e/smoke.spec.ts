import { test, expect } from '@playwright/test';

/**
 * Uses PLAYWRIGHT_CHANNEL (default: chrome) — see playwright.config.ts.
 * App should be running on PLAYWRIGHT_BASE_URL (default http://localhost:5173).
 */

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});

test('catalog route loads', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.locator('body')).toBeVisible();
});

test('Ctrl+K opens header search dialog', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByPlaceholder(/search books/i)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('catalog Apply writes q to URL', async ({ page }) => {
  await page.goto('/catalog');
  const search = page.locator('#catalog-q');
  await expect(search).toBeVisible();
  await search.fill('typescript');
  await page.getByRole('button', { name: /apply|اعمال/i }).click();
  await expect(page).toHaveURL(/[?&]q=typescript/);
});
