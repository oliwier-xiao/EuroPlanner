import { test, expect, Locator } from '@playwright/test';

async function fillStable(locator: Locator, value: string) {
  await expect(locator).toBeVisible();
  await expect(locator).toBeEditable();

  // Retry całego wpisania, bo kontrolowany input może zostać na moment wyczyszczony po re-renderze.
  await expect(async () => {
    await locator.click();
    await locator.fill('');
    await locator.pressSequentially(value, { delay: 30 });
    await expect(locator).toHaveValue(value, { timeout: 2000 });
  }).toPass({ timeout: 10000 });
}

async function signInWithCookie(page) {
  await page.context().addCookies([
    {
      name: 'auth-token',
      value: 'playwright-session',
      domain: 'localhost',
      path: '/',
    },
  ]);
}

test('Niezalogowany user trafia na strone logowania', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  // Zmiana: W nowym designie tytuł formularza to h2 "Witaj ponownie"
  await expect(page.locator('h2')).toContainText('Witaj ponownie');
});

test('Rejestracja i logowanie przekierowuja na dashboard', async ({ page }) => {
  await signInWithCookie(page);
  await page.goto('/dashboard', { waitUntil: 'commit' });

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Podróżniku');
});

test('Bledne dane logowania pokazuja blad', async ({ page }) => {
  await page.goto('/login');

  // Zmiana: używamy nowych placeholderów "admin" i "••••••••"
  await fillStable(page.getByPlaceholder('admin'), 'zly');
  await fillStable(page.getByPlaceholder('••••••••'), 'zly');
  
  await page.getByRole('button', { name: /Zaloguj się/i }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('Wylogowanie wraca na login', async ({ page }) => {
  await signInWithCookie(page);

  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/dashboard/);

  // Otwórz sidebar klikając przycisk menu
  await page.locator('header button').first().click();

  // Zmiana: Przycisk w panelu bocznym nazywa się teraz "Wyloguj"
  await page.getByRole('button', { name: 'Wyloguj' }).click();

  await expect(page).toHaveURL(/\/login/, { timeout: 20000 });
  await expect(page.locator('h2')).toContainText('Witaj ponownie');
});

test('Strona rejestracji sie laduje', async ({ page }) => {
  await page.goto('/register');

  // Zmiana: W nowym designie tytuł formularza to h2 "Załóż konto"
  await expect(page.locator('h2')).toContainText('Załóż konto');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});
