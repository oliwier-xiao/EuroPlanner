import { test, expect } from '@playwright/test';

const LOGIN_PAYLOAD = {
  name: 'Michał',
  password: 'balwan',
};

async function login(request) {
  const response = await request.post('/api/auth/login', {
    data: LOGIN_PAYLOAD,
  });

  expect(response.ok()).toBeTruthy();
}

test('API sesji zwraca zalogowanego użytkownika', async ({ request }) => {
  await login(request);

  const response = await request.get('/api/auth/me');
  expect(response.ok()).toBeTruthy();

  const payload = await response.json();
  expect(payload.success).toBeTruthy();
  expect(payload.user.displayName).toBe('Michał Cwynar');
});

test('Zalogowany user może utworzyć i pobrać podróż', async ({ request }) => {
  await login(request);

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