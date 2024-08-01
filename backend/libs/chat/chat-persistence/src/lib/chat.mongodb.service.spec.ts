import { ChatEntityDto } from '@backend/shared-types';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { ChatMongoDbService } from './chat.mongodb.service';
import { Chat, ChatDocument } from './schema/chat.schema';

describe('ChatMongoDbService', () => {
  let service: ChatMongoDbService;
  let chatModel: Model<ChatDocument>;

  const mockChat = (id: string, name: string): Partial<ChatEntityDto> => ({
    _id: id,
    name: name,
    messages: [],
    clients: {},
    created: new Date(),
    updated: new Date(),
  });

  const mockChatDocument = (
    id: string,
    name: string,
  ): Partial<Document<ChatEntityDto>> => ({
    toObject: jest.fn().mockReturnValue(mockChat(id, name)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMongoDbService,
        {
          provide: getModelToken(Chat.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatMongoDbService>(ChatMongoDbService);
    chatModel = module.get<Model<ChatDocument>>(getModelToken(Chat.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all chats', async () => {
      // arrange
      const expectedChats: Partial<ChatEntityDto>[] = [
        mockChat('1', 'chat1'),
        mockChat('2', 'chat2'),
      ];
      const result: Document<ChatEntityDto>[] = [
        mockChatDocument('1', 'chat1') as Document<ChatEntityDto>,
        mockChatDocument('2', 'chat2') as Document<ChatEntityDto>,
      ];
      jest.spyOn(chatModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.findAll()).toEqual(expectedChats);
    });
    it('should return empty array when no chats found', async () => {
      // arrange
      jest.spyOn(chatModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as never);

      // act & assert
      expect(await service.findAll()).toEqual([]);
    });

    it('should throw an error when finding all chats fails', async () => {
      // arrange
      const findAllChatsErrorMsg = 'Failed to find chats';
      jest.spyOn(chatModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(findAllChatsErrorMsg)),
      } as never);

      // act & assert
      await expect(service.findAll()).rejects.toThrow(findAllChatsErrorMsg);
    });
  });

  describe('findOne', () => {
    it('should find a chat by id', async () => {
      // arrange
      const chatId = '1';
      const expectedChat = mockChat(chatId, 'chat1');
      const result = mockChatDocument(
        chatId,
        'chat1',
      ) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.findOne(chatId)).toEqual(expectedChat);
    });
    it('should throw a not found exception when chat is not found', async () => {
      // arrange
      const chatId = '1';
      jest.spyOn(chatModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.findOne(chatId)).rejects.toThrow('Chat not found');
    });
    it('should throw an error when finding a chat by id fails', async () => {
      // arrange
      const chatId = '1';
      const findOneChatErrorMsg = 'Failed to find chat';
      jest.spyOn(chatModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(findOneChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.findOne(chatId)).rejects.toThrow(
        findOneChatErrorMsg,
      );
    });
  });

  describe('create', () => {
    it('should create a chat', async () => {
      // arrange
      const chatName = 'chat1';
      const expectedChat = mockChat('1', chatName);
      const result = mockChatDocument('1', chatName) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.create(chatName)).toEqual(expectedChat);
    });
    it('should throw an error when creating a chat fails', async () => {
      // arrange
      const createChatErrorMsg = 'Failed to create chat';
      jest.spyOn(chatModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(createChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.create('chat1')).rejects.toThrow(createChatErrorMsg);
    });
  });

  describe('update', () => {
    it('should update a chat', async () => {
      // arrange
      const chatId = '1';
      const chatName = 'chat1';
      const expectedChat = mockChat(chatId, chatName);
      const result = mockChatDocument(
        chatId,
        chatName,
      ) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.update(chatId, { name: chatName })).toEqual(
        expectedChat,
      );
    });
    it('should throw a not found exception when chat is not found', async () => {
      // arrange
      const chatId = '1';
      jest.spyOn(chatModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.update(chatId, { name: 'chat1' })).rejects.toThrow(
        'Chat not found',
      );
    });
    it('should throw an error when updating a chat fails', async () => {
      // arrange
      const chatId = '1';
      const updateChatErrorMsg = 'Failed to update chat';
      jest.spyOn(chatModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(updateChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.update(chatId, { name: 'chat1' })).rejects.toThrow(
        updateChatErrorMsg,
      );
    });
  });

  describe('remove', () => {
    it('should remove a chat', async () => {
      // arrange
      const chatId = '1';
      const expectedChat = mockChat(chatId, 'chat1');
      const result = mockChatDocument(
        chatId,
        'chat1',
      ) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.remove(chatId)).toEqual(expectedChat);
    });
    it('should throw a not found exception when chat is not found', async () => {
      // arrange
      const chatId = '1';
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.remove(chatId)).rejects.toThrow('Chat not found');
    });
    it('should throw an error when deleting a chat fails', async () => {
      // arrange
      const chatId = '1';
      const deleteChatErrorMsg = 'Failed to delete chat';
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(deleteChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.remove(chatId)).rejects.toThrow(deleteChatErrorMsg);
    });
  });
});
