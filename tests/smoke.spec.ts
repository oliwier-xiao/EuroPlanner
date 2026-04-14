import { test, expect } from '@playwright/test';

test('Niezalogowany user trafia na strone logowania', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('h1')).toContainText('Logowanie');
});

test('Logowanie admin/admin przekierowuje na dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Tutaj');
});

test('Bledne dane logowania pokazuja blad', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[type="text"]', 'zly');
  await page.fill('input[type="password"]', 'zly');
  await page.click('button[type="submit"]');

  await expect(page.locator('p.text-red-400')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test('Wylogowanie wraca na login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);

  await page.click('button:has-text("Wyloguj")');

  await expect(page).toHaveURL(/\/login/);
});

test('Strona rejestracji sie laduje', async ({ page }) => {
  await page.goto('/register');

  await expect(page.locator('h1')).toContainText('Rejestracja');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});