import { ADMIN_IDENTIFIER, BACKEND_URL } from './constants';

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ADMIN_IDENTIFIER}`,
});

const authHeaders = () => ({
  Authorization: `Bearer ${ADMIN_IDENTIFIER}`,
});

export const waitForBackendReady = async (
  maxRetries = 30,
  delayMs = 2000,
): Promise<void> => {
  const healthUrl = `${BACKEND_URL}/health/readyz`;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) return;
    } catch {
      // backend not ready yet
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Backend not ready after ${maxRetries * delayMs}ms`);
};

export const createTestIdentifier = async (name: string): Promise<string> => {
  const res = await fetch(`${BACKEND_URL}/identifiers`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to create test identifier: ${res.status} ${await res.text()}`,
    );
  }
  const data = await res.json();
  return data._id ?? data.id;
};

export const deleteTestIdentifier = async (id: string): Promise<void> => {
  const res = await fetch(`${BACKEND_URL}/identifiers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    console.warn(
      `Failed to delete test identifier ${id}: ${res.status} ${await res.text()}`,
    );
  }
};

export const createTestJoke = async (text: string): Promise<string> => {
  const res = await fetch(`${BACKEND_URL}/jokes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      language: 'de',
      verified: true,
      categories: [{ name: 'e2e', languague: 'de' }],
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to create test joke: ${res.status} ${await res.text()}`,
    );
  }
  const data = await res.json();
  return data._id ?? data.id;
};

export const deleteTestJoke = async (id: string): Promise<void> => {
  const res = await fetch(`${BACKEND_URL}/jokes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    console.warn(
      `Failed to delete test joke ${id}: ${res.status} ${await res.text()}`,
    );
  }
};
