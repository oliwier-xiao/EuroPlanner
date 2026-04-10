import { test, expect } from '@playwright/test';

test('EuroPlanner: Strona główna się ładuje', async ({ page }) => {
  // Używamy adresu IP Twojego serwera DietPi
  const serverUrl = 'http://192.168.0.203:3000';
  
  await page.goto(serverUrl);

  // Sprawdzamy, czy nagłówek h1 zawiera tekst z Twojego pliku app/page.tsx
  await expect(page.locator('h1')).toContainText('EuroPlanner');
});