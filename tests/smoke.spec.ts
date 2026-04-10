import { test, expect } from '@playwright/test';

test('EuroPlanner: Strona główna się ładuje', async ({ page }) => {
  // Playwright automatycznie użyje baseURL z pliku konfiguracyjnego
  // Jeśli chcesz zostać przy zmiennej wewnątrz testu, zrób tak:
  const serverUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  await page.goto('/'); // '/' oznacza teraz automatycznie baseURL z configu

  await expect(page.locator('h1')).toContainText('EuroPlanner');
});