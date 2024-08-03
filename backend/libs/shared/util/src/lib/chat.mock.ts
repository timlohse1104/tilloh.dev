import { MessageDto } from '@backend/shared-types';

export const mockMessageDto = (mock: Partial<MessageDto>): MessageDto => ({
  name: mock.name || 'mockName',
  text: mock.text || 'mockText',
  timestamp: mock.timestamp || new Date(),
});
