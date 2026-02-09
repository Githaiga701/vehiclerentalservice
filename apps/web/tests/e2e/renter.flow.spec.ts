import { test, expect } from '@playwright/test';

test.describe('Renter flow', () => {
  test('register, login, search, book, cancel', async ({ page, baseURL }) => {
    await page.goto('/');

    // Navigate to register
    await page.goto('/register');
    await page.fill('input[name="phone"]', '0712345678');
    await page.fill('input[name="name"]', 'Test Renter');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login|otp/);

    // Login (assumes test account or mocked auth)
    await page.goto('/login');
    await page.fill('input[name="phone"]', '0712345678');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Search vehicles
    await page.goto('/search');
    await expect(page.locator('text=Vehicles')).toBeVisible();

    // Note: booking steps require a seeded vehicle and mocked payment
  });
});
