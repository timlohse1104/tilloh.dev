import * as fs from 'fs';
import { deleteTestIdentifier, deleteTestJoke } from './helpers/api';
import { FRONTEND_CONFIG_FILE, TEST_STATE_FILE } from './helpers/constants';

export default async function globalTeardown() {
  if (!fs.existsSync(TEST_STATE_FILE)) {
    console.log('[E2E] No test state found, skipping teardown.');
    return;
  }

  const state = JSON.parse(fs.readFileSync(TEST_STATE_FILE, 'utf-8'));
  const { testIdentifierId, testJokeId } = state;

  if (testIdentifierId) {
    console.log(`[E2E] Deleting test identifier: ${testIdentifierId}`);
    await deleteTestIdentifier(testIdentifierId);
  }

  if (testJokeId) {
    console.log(`[E2E] Deleting seed joke: ${testJokeId}`);
    await deleteTestJoke(testJokeId);
  }

  fs.unlinkSync(TEST_STATE_FILE);
  console.log('[E2E] Test state cleaned up.');

  // Remove frontend config
  if (fs.existsSync(FRONTEND_CONFIG_FILE)) {
    fs.unlinkSync(FRONTEND_CONFIG_FILE);
    console.log('[E2E] Frontend config removed.');
  }
}
