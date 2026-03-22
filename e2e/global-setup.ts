import * as fs from 'fs';
import * as path from 'path';
import {
  createTestIdentifier,
  createTestJoke,
  waitForBackendReady,
} from './helpers/api';
import {
  BACKEND_URL,
  TEST_IDENTIFIER_NAME,
  TEST_STATE_FILE,
} from './helpers/constants';

// Path to the frontend config fetched by the browser (overrides API URL)
const FRONTEND_CONFIG_FILE = path.resolve(
  __dirname,
  '../frontend/static/config/config.json',
);

export default async function globalSetup() {
  // Point frontend at the E2E backend port
  fs.writeFileSync(
    FRONTEND_CONFIG_FILE,
    JSON.stringify({ backendUrl: BACKEND_URL }),
  );
  console.log(`[E2E] Frontend config written: backendUrl=${BACKEND_URL}`);

  console.log('\n[E2E] Waiting for backend to be ready...');
  await waitForBackendReady();
  console.log('[E2E] Backend is ready.');

  console.log('[E2E] Creating test identifier...');
  const testIdentifierId = await createTestIdentifier(TEST_IDENTIFIER_NAME);
  console.log(`[E2E] Test identifier created: ${testIdentifierId}`);

  console.log('[E2E] Creating seed joke...');
  const testJokeId = await createTestJoke(
    'E2E test joke: Why can programmers never sleep? Because they have too many loops.',
  );
  console.log(`[E2E] Seed joke created: ${testJokeId}`);

  const state = { testIdentifierId, testJokeId };
  fs.writeFileSync(TEST_STATE_FILE, JSON.stringify(state, null, 2));
  console.log('[E2E] Test state saved.');
}
