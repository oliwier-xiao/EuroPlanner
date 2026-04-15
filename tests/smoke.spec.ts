import { test, expect } from '@playwright/test';

async function fillStable(locator, value: string) {
  // WebKit bywa niestabilny przy szybkim fill; wpisywanie sekwencyjne jest wolniejsze, ale pewniejsze.
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(value, { delay: 30 });
  await expect(locator).toHaveValue(value);
}

async function registerUser(page, {
  name,
  surname,
  password,
}: { name: string; surname: string; password: string }) {
  await page.goto('/register');

  const nameInput = page.getByPlaceholder('Imię');
  const surnameInput = page.getByPlaceholder('Nazwisko');
  const passwordInput = page.getByPlaceholder('Hasło');

  await fillStable(nameInput, name);
  await fillStable(surnameInput, surname);
  await fillStable(passwordInput, password);
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

  await Promise.all([
    page.waitForURL(/\/login/),
    page.getByRole('link', { name: 'Zaloguj się' }).click(),
  ]);
  const loginNameInput = page.getByPlaceholder('Imię');
  const loginPasswordInput = page.getByPlaceholder('Hasło');

  await fillStable(loginNameInput, user.name);
  await fillStable(loginPasswordInput, user.password);

  const loginResponsePromise = page.waitForResponse(
    (res) =>
      res.url().includes('/api/auth/login') &&
      res.request().method() === 'POST' &&
      res.status() === 200
  );

  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  const loginResponse = await loginResponsePromise;

  expect(loginResponse.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Tutaj');
});

test('Bledne dane logowania pokazuja blad', async ({ page }) => {
  await page.goto('/login');

  await fillStable(page.getByPlaceholder('Imię'), 'zly');
  await fillStable(page.getByPlaceholder('Hasło'), 'zly');
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

  await Promise.all([
    page.waitForURL(/\/login/),
    page.getByRole('link', { name: 'Zaloguj się' }).click(),
  ]);
  const loginNameInput = page.getByPlaceholder('Imię');
  const loginPasswordInput = page.getByPlaceholder('Hasło');

  await fillStable(loginNameInput, user.name);
  await fillStable(loginPasswordInput, user.password);

  const loginResponsePromise = page.waitForResponse(
    (res) =>
      res.url().includes('/api/auth/login') &&
      res.request().method() === 'POST' &&
      res.status() === 200
  );

  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  const loginResponse = await loginResponsePromise;

  expect(loginResponse.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Wyloguj się' }).click();

  await expect(page).toHaveURL(/\/login/);
});

test('Strona rejestracji sie laduje', async ({ page }) => {
  await page.goto('/register');

  await expect(page.locator('h1')).toContainText('Rejestracja');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});