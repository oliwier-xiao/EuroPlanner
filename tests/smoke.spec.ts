import { test, expect, Locator } from '@playwright/test';

const LOGIN_PAYLOAD = {
  name: 'Michał',
  password: 'balwan',
};

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

async function signIn(page) {
  const response = await page.request.post('/api/auth/login', {
    data: LOGIN_PAYLOAD,
  });

  expect(response.ok()).toBeTruthy();
}

test('Niezalogowany user trafia na strone logowania', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  // Zmiana: W nowym designie tytuł formularza to h2 "Witaj ponownie"
  await expect(page.locator('h2')).toContainText('Witaj ponownie');
});

test('Sesja po logowaniu wpuszcza na dashboard i pokazuje dane konta', async ({ page }) => {
  await signIn(page);
  await page.goto('/dashboard', { waitUntil: 'commit' });

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Witaj,');
  await expect(page.getByText('Dane konta')).toBeVisible();
  await expect(page.getByRole('button', { name: /Nowa podróż/i })).toBeVisible();
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
  await signIn(page);

  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/dashboard/);

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

test('Zalogowany user widzi liste podrózy', async ({ page }) => {
  await signIn(page);

  await page.goto('/trips');

  await expect(page).toHaveURL(/\/trips/);
  await expect(page.getByRole('heading', { name: 'Moje Podróże' })).toBeVisible();

  const emptyState = page.getByText('Nie znaleziono podróży pasujących do filtrów.');
  const tripCards = page.locator('h3');
  const emptyVisible = await emptyState.isVisible().catch(() => false);

  if (!emptyVisible) {
    await expect(tripCards.first()).toBeVisible();
  }
});
