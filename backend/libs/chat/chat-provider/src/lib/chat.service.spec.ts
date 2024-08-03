import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { ChatEntityDto } from '@backend/shared-types';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';

const mockChatEntityDto = (mock: Partial<ChatEntityDto>) => ({
  _id: mock._id || 'mockId',
  name: mock.name || 'mockName',
  messages: mock.messages || [],
  clients: mock.clients || {},
  created: mock.created || new Date(),
  updated: mock.updated || new Date(),
  emoji: mock.emoji || 'mockEmoji',
  owner: mock.owner || 'mockOwner',
  securityQuestion: mock.securityQuestion || 'mockSecurityQuestion',
  securityAnswer: mock.securityAnswer || 'mockSecurityAnswer',
});

describe('ChatService', () => {
  let service: ChatService;
  let chatMongoDbServiceMock: ChatMongoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChatMongoDbService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        ChatService,
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatMongoDbServiceMock = module.get<ChatMongoDbService>(ChatMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Service should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('createChat', () => {
    it('should create a chat.', async () => {
      // arrange
      const chatName = 'foo';
      const chat = mockChatEntityDto({ name: chatName });
      jest.spyOn(chatMongoDbServiceMock, 'create').mockResolvedValue(chat);

      // act
      const result = await service.createChat(chatName);

      // assert
      expect(result).toEqual(chat);
      expect(chatMongoDbServiceMock.create).toHaveBeenCalledWith(chatName);
    });
    it('should throw an error if chat creation fails.', async () => {
      // arrange
      jest
        .spyOn(chatMongoDbServiceMock, 'create')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.createChat('chat')).rejects.toThrow();
    });
  });

  describe('listChats', () => {
    it('should list all chats.', async () => {
      // arrange
      const chat = mockChatEntityDto({});
      jest.spyOn(chatMongoDbServiceMock, 'findAll').mockResolvedValue([chat]);

      // act
      const result = await service.listChats();

      // assert
      expect(result).toEqual([chat]);
      expect(chatMongoDbServiceMock.findAll).toHaveBeenCalled();
    });
    it('should throw an error if chat listing fails.', async () => {
      // arrange
      jest
        .spyOn(chatMongoDbServiceMock, 'findAll')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.listChats()).rejects.toThrow();
    });
  });

  describe('findChat', () => {
    it('should find a chat.', async () => {
      // arrange
      const chatId = 'foo';
      const chat = mockChatEntityDto({ _id: chatId });
      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      // act
      const result = await service.findChat(chatId);

      // assert
      expect(result).toEqual(chat);
      expect(chatMongoDbServiceMock.findOne).toHaveBeenCalledWith(chatId);
    });
    it('should throw an error if chat finding fails.', async () => {
      // arrange
      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.findChat('chatId')).rejects.toThrow();
    });
  });

  describe('updateChat', () => {
    it('should update a chat.', async () => {
      // arrange
      const chatId = 'foo';
      const chat = mockChatEntityDto({ _id: chatId });
      jest.spyOn(chatMongoDbServiceMock, 'update').mockResolvedValue(chat);

      // act
      const result = await service.updateChat(chatId, chat);

      // assert
      expect(result).toEqual(chat);
      expect(chatMongoDbServiceMock.update).toHaveBeenCalledWith(chatId, chat);
    });
    it('should throw an error if chat updating fails.', async () => {
      // arrange
      jest
        .spyOn(chatMongoDbServiceMock, 'update')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(
        service.updateChat('chatId', mockChatEntityDto({})),
      ).rejects.toThrow();
    });
  });

  describe('removeChat', () => {
    it('should remove a chat.', async () => {
      // arrange
      const chatId = 'foo';
      const chat = mockChatEntityDto({ _id: chatId });
      jest.spyOn(chatMongoDbServiceMock, 'remove').mockResolvedValue(chat);

      // act
      const result = await service.removeChat(chatId);

      // assert
      expect(result).toEqual(chat);
      expect(chatMongoDbServiceMock.remove).toHaveBeenCalledWith(chatId);
    });
    it('should throw an error if chat removal fails.', async () => {
      // arrange
      jest
        .spyOn(chatMongoDbServiceMock, 'remove')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.removeChat('chatId')).rejects.toThrow();
    });
  });
});
