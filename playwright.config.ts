import { defineConfig, devices } from '@playwright/test';

/**
 * Zdefiniuj adres bazowy. 
 * Jeśli zmienna środowiskowa BASE_URL nie istnieje, użyj localhost.
 */
const PORT = 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Reporter 'dot' lub 'list' jest czytelniejszy w logach GitHub Actions niż 'html' */
  reporter: process.env.CI ? 'list' : 'html',
  
  use: {
    /* Używamy zmiennej baseURL zdefiniowanej powyżej */
    baseURL: baseURL,
    trace: 'on-first-retry',
    /* Pomocne przy testowaniu na Malince/VPN, jeśli są problemy z certyfikatami */
    ignoreHTTPSErrors: true,
  },

  /* Ta sekcja automatycznie uruchamia serwer Next.js przed testami.
    Dzięki temu nie musisz ręcznie wpisywać `npm run dev` w osobnym oknie.
  */
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Malinka może potrzebować więcej czasu na start (2 minuty)
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});