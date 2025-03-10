import { ChatEntityDto } from '@backend/shared-types';
import { mockChatEntityDto } from '@backend/util';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { ChatMongoDbService } from './chat.mongodb.service';
import { Chat, ChatDocument } from './schema/chat.schema';

describe('ChatMongoDbService', () => {
  let service: ChatMongoDbService;
  let chatModel: Model<ChatDocument>;

  const chat1 = { _id: '1', name: 'chat1' };
  const chat2 = { _id: '2', name: 'chat2' };

  const mockChatDocument = (
    mock: Partial<ChatEntityDto>,
  ): Partial<Document<ChatEntityDto>> => ({
    toObject: jest.fn().mockReturnValue(mockChatEntityDto(mock)),
  });

  beforeAll(() => {
    jest.useFakeTimers();
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
        mockChatEntityDto(chat1),
        mockChatEntityDto(chat2),
      ];
      const result: Document<ChatEntityDto>[] = [
        mockChatDocument(chat1) as Document<ChatEntityDto>,
        mockChatDocument(chat2) as Document<ChatEntityDto>,
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
      const expectedChat = mockChatEntityDto(chat1);
      const result = mockChatDocument(chat1) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.findOne(chat1._id)).toEqual(expectedChat);
    });
    it('should throw a not found exception when chat is not found', async () => {
      // arrange
      jest.spyOn(chatModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.findOne(chat1._id)).rejects.toThrow(
        'Chat not found',
      );
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
      const expectedChat = mockChatEntityDto(chat1);
      const result = mockChatDocument(chat1) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.create(chat1.name)).toEqual(expectedChat);
    });
    it('should throw an error when creating a chat fails', async () => {
      // arrange
      const createChatErrorMsg = 'Failed to create chat';
      jest.spyOn(chatModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(createChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.create(chat1.name)).rejects.toThrow(
        createChatErrorMsg,
      );
    });
  });

  describe('update', () => {
    it('should update a chat', async () => {
      // arrange
      const expectedChat = mockChatEntityDto(chat1);
      const result = mockChatDocument(chat1) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.update(chat1._id, { name: chat1.name })).toEqual(
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
      const expectedChat = mockChatEntityDto(chat1);
      const result = mockChatDocument(chat1) as Document<ChatEntityDto>;
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.remove(chat1._id)).toEqual(expectedChat);
    });
    it('should throw a not found exception when chat is not found', async () => {
      // arrange
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.remove(chat1._id)).rejects.toThrow('Chat not found');
    });
    it('should throw an error when deleting a chat fails', async () => {
      // arrange
      const deleteChatErrorMsg = 'Failed to delete chat';
      jest.spyOn(chatModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(deleteChatErrorMsg)),
      } as never);

      // act & assert
      await expect(service.remove(chat1._id)).rejects.toThrow(
        deleteChatErrorMsg,
      );
    });
  });
});
