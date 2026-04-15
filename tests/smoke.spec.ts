import { test, expect } from '@playwright/test';

async function registerUser(page, {
  name,
  surname,
  password,
}: { name: string; surname: string; password: string }) {
  await page.goto('/register');

  await page.getByPlaceholder('Imię').fill(name);
  await page.getByPlaceholder('Nazwisko').fill(surname);
  await page.getByPlaceholder('Hasło').fill(password);
  await page.getByRole('button', { name: 'Zarejestruj się' }).click();

  // po udanej rejestracji formularz czyści pola – poczekaj na ten stan,
  // żeby mieć pewność, że użytkownik został utworzony zanim spróbujemy się zalogować
  await expect(page.getByPlaceholder('Imię')).toHaveValue('');
}

test('Niezalogowany user trafia na strone logowania', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('h1')).toContainText('Logowanie');
});

test('Rejestracja i logowanie przekierowuja na dashboard', async ({ page }) => {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const user = {
    name: `Playwright${suffix}`,
    surname: `User${suffix}`,
    password: 'haslo123!',
  };

  await registerUser(page, user);

  await page.goto('/login');
  await page.getByPlaceholder('Imię').fill(user.name);
  await page.getByPlaceholder('Hasło').fill(user.password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse((res) =>
      res.url().includes('/api/auth/login') && res.request().method() === 'POST'
    ),
    page.getByRole('button', { name: 'Zaloguj się' }).click(),
  ]);

  expect(loginResponse.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Tutaj');
});

test('Bledne dane logowania pokazuja blad', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Imię').fill('zly');
  await page.getByPlaceholder('Hasło').fill('zly');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('Wylogowanie wraca na login', async ({ page }) => {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const user = {
    name: `PlaywrightLogout${suffix}`,
    surname: `User${suffix}`,
    password: 'haslo123!',
  };

  await registerUser(page, user);

  await page.goto('/login');
  await page.getByPlaceholder('Imię').fill(user.name);
  await page.getByPlaceholder('Hasło').fill(user.password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse((res) =>
      res.url().includes('/api/auth/login') && res.request().method() === 'POST'
    ),
    page.getByRole('button', { name: 'Zaloguj się' }).click(),
  ]);

  expect(loginResponse.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Wyloguj' }).click();

  await expect(page).toHaveURL(/\/login/);
});

test('Strona rejestracji sie laduje', async ({ page }) => {
  await page.goto('/register');

  await expect(page.locator('h1')).toContainText('Rejestracja');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});