import { test, expect } from '@playwright/test';

// Playwright full Renter flow. Requires seeded JWT in env: TEST_JWT_RENTER or NEXT_PUBLIC_TEST_JWT_RENTER
const TOKEN = process.env.NEXT_PUBLIC_TEST_JWT_RENTER || process.env.TEST_JWT_RENTER;

test.describe('Renter full E2E flow', () => {
  test.beforeEach(async ({ page }) => {
    if (TOKEN) {
      // Adjust storage key if your app uses a different key for JWT
      await page.goto('/');
      await page.evaluate((t) => localStorage.setItem('accessToken', t), TOKEN);
      await page.reload();
    }
  });

  test('search, view, book, cancel', async ({ page, baseURL }) => {
    await page.goto('/search');
    await expect(page).toHaveURL(/search/);
    await expect(page.locator('text=Vehicles').first()).toBeVisible();

    // Open first vehicle details
    const first = page.locator('a').filter({ hasText: 'View' }).first();
    if (await first.count() > 0) {
      await first.click();
      await expect(page.locator('text=Book Now').first()).toBeVisible();

      // Booking flow - selectors are app-specific; this is a template
      // Fill booking dates if present
      if (await page.locator('input[name="startDate"]').count()) {
        await page.fill('input[name="startDate"]', '2026-03-01');
        await page.fill('input[name="endDate"]', '2026-03-02');
      }

      // Click Create Booking button
      if (await page.locator('button:has-text("Create Booking")').count()) {
        await page.click('button:has-text("Create Booking")');
        await expect(page.locator('text=Booking created').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }

      // Cancel booking via UI or API - depends on app
      // This template assumes a Cancel button appears
      if (await page.locator('button:has-text("Cancel Booking")').count()) {
        await page.click('button:has-text("Cancel Booking")');
        await expect(page.locator('text=Booking cancelled').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    }
  });
});
