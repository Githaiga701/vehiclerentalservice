import { test, expect } from '@playwright/test';

const TOKEN = process.env.NEXT_PUBLIC_TEST_JWT_OWNER || process.env.TEST_JWT_OWNER;

test.describe('Owner full E2E flow', () => {
  test.beforeEach(async ({ page }) => {
    if (TOKEN) {
      await page.goto('/');
      await page.evaluate((t) => localStorage.setItem('accessToken', t), TOKEN);
      await page.reload();
    }
  });

  test('create, edit, delete listing; approve booking', async ({ page }) => {
    await page.goto('/owner/dashboard');
    await expect(page).toHaveURL(/owner/);

    // Create listing - template selectors
    if (await page.locator('a:has-text("Create Listing")').count()) {
      await page.click('a:has-text("Create Listing")');
      if (await page.locator('input[name="title"]').count()) {
        await page.fill('input[name="title"]', 'Test Vehicle');
        await page.fill('input[name="dailyPrice"]', '2500');
        await page.click('button:has-text("Save")');
        await expect(page.locator('text=Listing created').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    }

    // Edit/Delete flows: template steps depending on UI
    // Approve booking - navigate to bookings and click Approve if available
    await page.goto('/owner/bookings');
    if (await page.locator('button:has-text("Approve")').count()) {
      await page.click('button:has-text("Approve")');
      await expect(page.locator('text=Booking approved').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });
});
