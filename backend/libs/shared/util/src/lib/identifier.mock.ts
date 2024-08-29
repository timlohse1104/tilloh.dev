import { IdentifierDto } from '@backend/shared-types';

export const mockIdentifierDto = (
  mock: Partial<IdentifierDto>,
): IdentifierDto => ({
  _id: mock?._id || 'mock_id',
  name: mock?.name || 'mock_name',
  created: mock?.created || new Date(),
  updated: mock?.updated || new Date(),
});
