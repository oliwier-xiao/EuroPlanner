import { test, expect, Locator } from '@playwright/test';

const backendE2EEnabled = process.env.BACKEND_E2E !== 'false';

function createCredentials() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    name: `autotest_${suffix}`,
    surname: 'Smoke',
    password: 'test1234',
  };
}

async function ensureLoggedOut(page) {
  await page.request.post('/api/auth/logout', { timeout: 10_000 });
}

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

async function registerAndSignIn(page) {
  const credentials = createCredentials();

  const registerResponse = await page.request.post('/api/auth/register', {
    data: {
      name: credentials.name,
      surname: credentials.surname,
      password: credentials.password,
    },
    timeout: 10_000,
  });

  if (!registerResponse.ok()) {
    throw new Error(`Register failed: ${registerResponse.status()} ${await registerResponse.text()}`);
  }

  const response = await page.request.post('/api/auth/login', {
    data: {
      name: credentials.name,
      password: credentials.password,
    },
    timeout: 10_000,
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
  }

  return credentials;
}

test('Niezalogowany user trafia na strone logowania', async ({ page }) => {
  await ensureLoggedOut(page);
  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  // Zmiana: W nowym designie tytuł formularza to h2 "Witaj ponownie"
  await expect(page.locator('h2')).toContainText('Witaj ponownie');
});

test('Sesja po logowaniu wpuszcza na dashboard i pokazuje dane konta', async ({ page }) => {
  test.skip(!backendE2EEnabled, 'Pomijam test backendowy: Supabase niedostępny w tym środowisku CI.');
  await registerAndSignIn(page);
  await page.goto('/dashboard', { waitUntil: 'commit' });

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Witaj,');
  await expect(page.getByText('Dane konta')).toBeVisible();
  await expect(page.getByRole('button', { name: /Nowa podróż/i })).toBeVisible();
});

test('Bledne dane logowania pokazuja blad', async ({ page }) => {
  test.skip(!backendE2EEnabled, 'Pomijam test backendowy: Supabase niedostępny w tym środowisku CI.');
  await ensureLoggedOut(page);
  await page.goto('/login');

  // Zmiana: placeholder loginu to "jan_kowal" (przykładowy username), hasło "••••••••"
  await fillStable(page.getByPlaceholder('jan_kowal'), 'zly');
  await fillStable(page.getByPlaceholder('••••••••'), 'zly');
  
  await page.getByRole('button', { name: /Zaloguj się/i }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('Wylogowanie wraca na login', async ({ page }) => {
  test.skip(!backendE2EEnabled, 'Pomijam test backendowy: Supabase niedostępny w tym środowisku CI.');
  await registerAndSignIn(page);

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
  await ensureLoggedOut(page);
  await page.goto('/register');

  // Zmiana: W nowym designie tytuł formularza to h2 "Załóż konto"
  await expect(page.locator('h2')).toContainText('Załóż konto');
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});

test('Zalogowany user widzi liste podrózy', async ({ page }) => {
  test.skip(!backendE2EEnabled, 'Pomijam test backendowy: Supabase niedostępny w tym środowisku CI.');
  await registerAndSignIn(page);

  const tripTitle = `Smoke trip ${Date.now()}`;
  const createTripResponse = await page.request.post('/api/trips', {
    data: {
      title: tripTitle,
      description: 'Trip stworzony w smoke tescie',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      budget_limit: 800,
    },
    timeout: 10_000,
  });

  if (!createTripResponse.ok()) {
    throw new Error(`Create trip failed: ${createTripResponse.status()} ${await createTripResponse.text()}`);
  }

  await page.goto('/trips');

  await expect(page).toHaveURL(/\/trips/);
  await expect(page.getByRole('heading', { name: 'Moje Podróże' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: tripTitle })).toBeVisible();
});
