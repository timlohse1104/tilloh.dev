import { UpdateMessageDto } from '@backend/shared-types';
import { mockChatEntityDto, mockMessageDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatMongoDbService } from './chat.mongodb.service';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let chatMongoDbServiceMock: ChatMongoDbService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

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
        MessagesService,
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    chatMongoDbServiceMock = module.get<ChatMongoDbService>(ChatMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      // arrange
      const chatId = 'foo';
      const messageDto = mockMessageDto({ text: 'bar' });
      const createMessageDto = { chatId, ...messageDto };
      const chat = mockChatEntityDto({ messages: [] });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      chat.messages.push(messageDto);
      jest.spyOn(chatMongoDbServiceMock, 'update').mockResolvedValue(chat);

      // act
      const result = await service.createMessage(createMessageDto);

      // assert
      expect(result).toEqual(createMessageDto);
      expect(chat.messages).toContain(messageDto);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const createMessageDto = { chatId, ...mockMessageDto({ text: 'bar' }) };

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act
      try {
        await service.createMessage(createMessageDto);
      } catch (error) {
        // assert
        expect(error).toBeInstanceOf(Error);
      }
    });
    it('should throw an error if chat update fails', async () => {
      // arrange
      const chatId = 'foo';
      const createMessageDto = { chatId, ...mockMessageDto({ text: 'bar' }) };
      const chat = mockChatEntityDto({ messages: [] });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);
      jest
        .spyOn(chatMongoDbServiceMock, 'update')
        .mockRejectedValue(new Error());

      // act
      try {
        await service.createMessage(createMessageDto);
      } catch (error) {
        // assert
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('listMessages', () => {
    it('should list messages', async () => {
      // arrange
      const chatId = 'foo';
      const chat = mockChatEntityDto({ messages: [mockMessageDto({})] });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      // act
      const result = await service.listMessages(chatId);

      // assert
      expect(result).toEqual(chat.messages);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.listMessages(chatId)).rejects.toThrow();
    });
  });

  describe('findMessage', () => {
    it('should find a message', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const message = mockMessageDto({});

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockResolvedValue(mockChatEntityDto({ messages: [message] }));

      // act
      const result = await service.findMessage(chatId, messageId);

      // assert
      expect(result).toEqual(message);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.findMessage(chatId, messageId)).rejects.toThrow();
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const messageDto = mockMessageDto({ text: 'bar' });
      const updateMessageDto: UpdateMessageDto = {
        id: messageId,
        chatId,
        ...messageDto,
      };
      const chat = mockChatEntityDto({ messages: [mockMessageDto({})] });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      chat.messages[messageId] = messageDto;
      jest.spyOn(chatMongoDbServiceMock, 'update').mockResolvedValue(chat);

      // act
      const result = await service.updateMessage(
        chatId,
        messageId,
        updateMessageDto,
      );

      // assert
      expect(result).toEqual(updateMessageDto);
      expect(chat.messages[messageId]).toEqual(updateMessageDto);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const messageDto = mockMessageDto({ text: 'bar' });
      const updateMessageDto = { id: messageId, chatId, ...messageDto };

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(
        service.updateMessage(chatId, messageId, updateMessageDto),
      ).rejects.toThrow();
    });
    it('should throw an error if chat update fails', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const messageDto = mockMessageDto({ text: 'bar' });
      const updateMessageDto = { id: messageId, chatId, ...messageDto };
      const chat = mockChatEntityDto({ messages: [mockMessageDto({})] });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);
      jest
        .spyOn(chatMongoDbServiceMock, 'update')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(
        service.updateMessage(chatId, messageId, updateMessageDto),
      ).rejects.toThrow();
    });
  });

  describe('removeMessage', () => {
    it('should remove a message', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const message = mockMessageDto({});

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockResolvedValue(mockChatEntityDto({ messages: [message] }));

      // act
      const result = await service.removeMessage(chatId, messageId);

      // assert
      expect(result).toEqual(message);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.removeMessage(chatId, messageId)).rejects.toThrow();
    });
    it('should throw an error if chat update fails', async () => {
      // arrange
      const chatId = 'foo';
      const messageId = 0;
      const message = mockMessageDto({});

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockResolvedValue(mockChatEntityDto({ messages: [message] }));
      jest
        .spyOn(chatMongoDbServiceMock, 'update')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.removeMessage(chatId, messageId)).rejects.toThrow();
    });
  });

  describe('identify', () => {
    it('should identify a client', async () => {
      // arrange
      const chatId = 'foo';
      const name = 'bar';
      const clientId = 'baz';
      const chat = mockChatEntityDto({ clients: {} });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      chat.clients[clientId] = name;
      jest.spyOn(chatMongoDbServiceMock, 'update').mockResolvedValue(chat);

      // act
      const result = await service.identify(chatId, name, clientId);

      // assert
      expect(result).toEqual(Object.values(chat.clients));
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const name = 'bar';
      const clientId = 'baz';

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.identify(chatId, name, clientId)).rejects.toThrow();
    });
    it('should throw an error if chat update fails', async () => {
      // arrange
      const chatId = 'foo';
      const name = 'bar';
      const clientId = 'baz';
      const chat = mockChatEntityDto({ clients: {} });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);
      jest
        .spyOn(chatMongoDbServiceMock, 'update')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.identify(chatId, name, clientId)).rejects.toThrow();
    });
  });

  describe('getClientName', () => {
    it('should get a client name', async () => {
      // arrange
      const chatId = 'foo';
      const clientId = 'bar';
      const name = 'baz';
      const chat = mockChatEntityDto({ clients: { [clientId]: name } });

      jest.spyOn(chatMongoDbServiceMock, 'findOne').mockResolvedValue(chat);

      // act
      const result = await service.getClientName(chatId, clientId);

      // assert
      expect(result).toEqual(name);
    });
    it('should throw an error if chat findOne fails', async () => {
      // arrange
      const chatId = 'foo';
      const clientId = 'bar';

      jest
        .spyOn(chatMongoDbServiceMock, 'findOne')
        .mockRejectedValue(new Error());

      // act & assert
      await expect(service.getClientName(chatId, clientId)).rejects.toThrow();
    });
  });
});
