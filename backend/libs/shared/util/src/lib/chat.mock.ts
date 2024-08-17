import { ChatEntityDto, MessageDto } from '@backend/shared-types';

export const mockChatEntityDto = (
  mock?: Partial<ChatEntityDto>,
): ChatEntityDto => {
  return {
    _id: mock?._id || '1',
    name: mock?.name || 'name',
    messages: mock?.messages || [],
    clients: mock?.clients || {},
    created: mock?.created || new Date(),
    updated: mock?.updated || new Date(),
    emoji: mock?.emoji || 'emoji',
    owner: mock?.owner || 'owner',
    securityQuestion: mock?.securityQuestion || 'securityQuestion',
    securityAnswer: mock?.securityAnswer || 'securityAnswer',
  };
};

export const mockMessageDto = (mock: Partial<MessageDto>): MessageDto => ({
  name: mock.name || 'mockName',
  text: mock.text || 'mockText',
  timestamp: mock.timestamp || new Date(),
});
