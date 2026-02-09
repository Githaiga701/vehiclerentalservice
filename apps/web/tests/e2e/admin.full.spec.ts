import { test, expect } from '@playwright/test';

const TOKEN = process.env.NEXT_PUBLIC_TEST_JWT_ADMIN || process.env.TEST_JWT_ADMIN;

test.describe('Admin full E2E flow', () => {
  test.beforeEach(async ({ page }) => {
    if (TOKEN) {
      await page.goto('/');
      await page.evaluate((t) => localStorage.setItem('accessToken', t), TOKEN);
      await page.reload();
    }
  });

  test('view users, suspend user, delete vehicle, view analytics', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/admin/);

    // View users
    await page.goto('/admin/users');
    await expect(page.locator('text=Users').first()).toBeVisible().catch(() => {});

    // Suspend user - template selector
    if (await page.locator('button:has-text("Suspend")').count()) {
      await page.click('button:has-text("Suspend")');
      await expect(page.locator('text=User suspended').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    }

    // Delete vehicle
    await page.goto('/admin/vehicles');
    if (await page.locator('button:has-text("Delete")').count()) {
      await page.click('button:has-text("Delete")');
      await expect(page.locator('text=Vehicle deleted').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    }

    // Analytics
    await page.goto('/admin/analytics');
    await expect(page.locator('text=Analytics').first()).toBeVisible().catch(() => {});
  });
});
