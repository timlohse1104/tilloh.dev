import { KeystoreDto } from '@backend/shared-types';

export const mockKeystoreDto = (mock: Partial<KeystoreDto>): KeystoreDto => ({
  identifier: mock?.identifier || 'mock_identifier',
  key: mock?.key || 'mock_key',
  value: mock?.value || 'mock_value',
  created: mock?.created || new Date(),
  updated: mock?.updated || new Date(),
});
