import { ListDto, ListEntryDto } from '@backend/shared-types';

export const mockListEntryDto = (
  mock: Partial<ListEntryDto>,
): ListEntryDto => ({
  _id: mock._id || 'mockId',
  title: mock.title || 'mockTitle',
  done: mock?.done || false,
  created: mock?.created || new Date(),
  updated: mock?.updated || new Date(),
});

export const mockListDto = (mock: Partial<ListDto>): ListDto => ({
  _id: mock._id || 'mockId',
  name: mock.name || 'mockName',
  emoji: mock.emoji || 'mockEmoji',
  entries: mock?.entries || [],
  history: mock?.history || [],
  created: mock?.created || new Date(),
  updated: mock?.updated || new Date(),
});
