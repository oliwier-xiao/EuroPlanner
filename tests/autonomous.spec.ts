import { test, expect } from '@playwright/test';

function createCredentials() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    name: `autotest_${suffix}`,
    surname: 'Api',
    password: 'test1234',
  };
}

async function registerAndLogin(request) {
  const credentials = createCredentials();

  const registerResponse = await request.post('/api/auth/register', {
    data: credentials,
    timeout: 10_000,
  });

  expect(registerResponse.ok()).toBeTruthy();

  const response = await request.post('/api/auth/login', {
    data: {
      name: credentials.name,
      password: credentials.password,
    },
    timeout: 10_000,
  });

  expect(response.ok()).toBeTruthy();

  return credentials;
}

test('API sesji zwraca zalogowanego użytkownika', async ({ request }) => {
  const credentials = await registerAndLogin(request);

  const response = await request.get('/api/auth/me');
  expect(response.ok()).toBeTruthy();

  const payload = await response.json();
  expect(payload.success).toBeTruthy();
  expect(payload.user.displayName).toContain(credentials.name);
});

test('Zalogowany user może utworzyć i pobrać podróż', async ({ request }) => {
  await registerAndLogin(request);

  const tripTitle = `Autotest ${Date.now()}`;

  const createResponse = await request.post('/api/trips', {
    data: {
      title: tripTitle,
      description: 'Automatyczny test tworzenia podróży',
      start_date: '2026-05-01',
      end_date: '2026-05-04',
      budget_limit: 1250,
    },
  });

  expect(createResponse.ok()).toBeTruthy();

  const createPayload = await createResponse.json();
  expect(createPayload.success).toBeTruthy();
  expect(createPayload.trip.name).toBe(tripTitle);

  const tripsResponse = await request.get('/api/trips');
  expect(tripsResponse.ok()).toBeTruthy();

  const tripsPayload = await tripsResponse.json();
  expect(tripsPayload.success).toBeTruthy();
  expect(Array.isArray(tripsPayload.trips)).toBeTruthy();
  expect(tripsPayload.trips.some((trip: { name: string }) => trip.name === tripTitle)).toBeTruthy();
});