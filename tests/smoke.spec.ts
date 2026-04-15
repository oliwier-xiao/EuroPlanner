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

  // Stabilny sygnał sukcesu rejestracji zamiast zależności od czyszczenia formularza.
  await expect(page.getByText('Konto zostało utworzone. Możesz się zalogować.')).toBeVisible();
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
  await page.waitForTimeout(1000);

  await page.locator('a[href="/login"]').click();
  await expect(page).toHaveURL(/\/login/);
  const loginNameInput = page.getByPlaceholder('Imię');
  const loginPasswordInput = page.getByPlaceholder('Hasło');

  await fillStable(loginNameInput, user.name);
  await fillStable(loginPasswordInput, user.password);

  // Ostatnia walidacja tuż przed submitem: jeśli inputy zostaną wyczyszczone przez re-render,
  // test pokaże to od razu zamiast timeoutu na waitForResponse.
  await expect(loginNameInput).toHaveValue(user.name);
  await expect(loginPasswordInput).toHaveValue(user.password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/api/auth/login') &&
        res.request().method() === 'POST',
      { timeout: 15000 }
    ),
    page.getByRole('button', { name: 'Zaloguj się' }).click(),
  ]);

  expect(loginResponse.status(), 'Oczekiwano statusu 200 z /api/auth/login').toBe(200);
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
  await page.waitForTimeout(1000);

  await page.locator('a[href="/login"]').click();
  await expect(page).toHaveURL(/\/login/);
  const loginNameInput = page.getByPlaceholder('Imię');
  const loginPasswordInput = page.getByPlaceholder('Hasło');

  await fillStable(loginNameInput, user.name);
  await fillStable(loginPasswordInput, user.password);

  await expect(loginNameInput).toHaveValue(user.name);
  await expect(loginPasswordInput).toHaveValue(user.password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/api/auth/login') &&
        res.request().method() === 'POST',
      { timeout: 15000 }
    ),
    page.getByRole('button', { name: 'Zaloguj się' }).click(),
  ]);

  expect(loginResponse.status(), 'Oczekiwano statusu 200 z /api/auth/login').toBe(200);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Wyloguj się' }).click();

  await expect(page).toHaveURL(/\/login/);
});

test('Strona rejestracji sie laduje', async ({ page }) => {
  await page.goto('/register');

  await expect(page.locator('h1')).toContainText('Rejestracja');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});