import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

export const BACKEND_URL =
  process.env.E2E_BACKEND_URL || 'http://localhost:61155/v1';
export const FRONTEND_URL =
  process.env.E2E_FRONTEND_URL || 'http://localhost:5173';
export const ADMIN_IDENTIFIER =
  process.env.E2E_ADMIN_IDENTIFIER || 'e2e-admin-identifier';

export const TEST_IDENTIFIER_NAME = 'e2e-test-user';
export const TEST_STATE_FILE = path.resolve(__dirname, '../.test-state.json');
