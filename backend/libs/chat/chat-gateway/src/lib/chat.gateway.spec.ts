import { MessagesService } from '@backend/chat/chat-provider';
import {
  CreateMessageDto,
  IdentifyMessageDto,
  JoinRoomDto,
  MessageDto,
  TypingDto,
  UpdateMessageDto,
} from '@backend/shared-types';
import { mockMessageDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messagesService: MessagesService;
  let mockServer: any;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    mockServer = { emit: jest.fn(), on: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MessagesService,
          useValue: {
            createMessage: jest.fn(),
            listMessages: jest.fn(),
            findMessage: jest.fn(),
            updateMessage: jest.fn(),
            removeMessage: jest.fn(),
            identify: jest.fn(),
            getClientName: jest.fn(),
          },
        },
        ChatGateway,
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    messagesService = module.get<MessagesService>(MessagesService);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Gateway should be defined.', () => {
    expect(gateway).toBeDefined();
  });

  describe('create', () => {
    it('should return the created message', async () => {
      // arrange
      const createMessageDto: CreateMessageDto = {
        chatId: 'chatId',
        name: 'name',
        text: 'text',
        timestamp: new Date(),
      };

      const { name, text, timestamp } = createMessageDto;
      const message = mockMessageDto({
        name,
        text,
        timestamp,
      });

      jest
        .spyOn(messagesService, 'createMessage')
        .mockResolvedValueOnce(message);

      // act & assert
      await expect(gateway.create(createMessageDto)).resolves.toBe(message);
      expect(mockServer.emit).toHaveBeenCalledWith('message', message);
    });
    it('should throw an error if the message creation fails', async () => {
      // arrange
      const createMessageDto: CreateMessageDto = {
        chatId: 'chatId',
        name: 'name',
        text: 'text',
        timestamp: new Date(),
      };

      const createMessageErrorMsg = 'Failed to create message';
      jest
        .spyOn(messagesService, 'createMessage')
        .mockRejectedValueOnce(new Error(createMessageErrorMsg));

      // act & assert
      await expect(gateway.create(createMessageDto)).rejects.toThrow(
        createMessageErrorMsg,
      );
      expect(mockServer.emit).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      // arrange
      const chatId = 'chatId';
      const messages = [mockMessageDto({}), mockMessageDto({})] as MessageDto[];
      jest
        .spyOn(messagesService, 'listMessages')
        .mockResolvedValueOnce(messages);

      // act & assert
      await expect(gateway.findAll(chatId)).resolves.toEqual(messages);
    });
    it('should throw an error if the message retrieval fails', async () => {
      // arrange
      const chatId = 'chatId';
      const listMessagesErrorMsg = 'Failed to list messages';
      jest
        .spyOn(messagesService, 'listMessages')
        .mockRejectedValueOnce(new Error(listMessagesErrorMsg));

      // act & assert
      await expect(gateway.findAll(chatId)).rejects.toThrow(
        listMessagesErrorMsg,
      );
    });
  });

  describe('findOne', () => {
    it('should return the message', async () => {
      // arrange
      const chatId = 'chatId';
      const id = 1;
      const message = mockMessageDto({});
      jest.spyOn(messagesService, 'findMessage').mockResolvedValueOnce(message);

      // act & assert
      await expect(gateway.findOne({ chatId, id })).resolves.toEqual(message);
    });
    it('should throw an error if the message retrieval fails', async () => {
      // arrange
      const chatId = 'chatId';
      const id = 1;
      const findMessageErrorMsg = 'Failed to find message';
      jest
        .spyOn(messagesService, 'findMessage')
        .mockRejectedValueOnce(new Error(findMessageErrorMsg));

      // act & assert
      await expect(gateway.findOne({ chatId, id })).rejects.toThrow(
        findMessageErrorMsg,
      );
    });
  });

  describe('update', () => {
    it('should return the updated message', async () => {
      // arrange
      const updateMessageDto: UpdateMessageDto = {
        id: 1,
        chatId: 'chatId',
        name: 'name',
        text: 'text',
        timestamp: new Date(),
      };

      const { name, text, timestamp } = updateMessageDto;
      const message = mockMessageDto({
        name,
        text,
        timestamp,
      });

      jest
        .spyOn(messagesService, 'updateMessage')
        .mockResolvedValueOnce(message);

      // act & assert
      await expect(gateway.update(updateMessageDto)).resolves.toBe(message);
    });
    it('should throw an error if the message update fails', async () => {
      // arrange
      const updateMessageDto: UpdateMessageDto = {
        id: 1,
        chatId: 'chatId',
        name: 'name',
        text: 'text',
        timestamp: new Date(),
      };

      const updateMessageErrorMsg = 'Failed to update message';
      jest
        .spyOn(messagesService, 'updateMessage')
        .mockRejectedValueOnce(new Error(updateMessageErrorMsg));

      // act & assert
      await expect(gateway.update(updateMessageDto)).rejects.toThrow(
        updateMessageErrorMsg,
      );
    });
  });

  describe('remove', () => {
    it('should return the removed message', async () => {
      // arrange
      const identifyMessageDto: IdentifyMessageDto = {
        chatId: 'chatId',
        id: 1,
      };
      const message = mockMessageDto({});
      jest
        .spyOn(messagesService, 'removeMessage')
        .mockResolvedValueOnce(message);

      // act & assert
      await expect(gateway.remove(identifyMessageDto)).resolves.toEqual(
        message,
      );
    });
    it('should throw an error if the message removal fails', async () => {
      // arrange
      const identifyMessageDto: IdentifyMessageDto = {
        chatId: 'chatId',
        id: 1,
      };
      const removeMessageErrorMsg = 'Failed to remove message';
      jest
        .spyOn(messagesService, 'removeMessage')
        .mockRejectedValueOnce(new Error(removeMessageErrorMsg));

      // act & assert
      await expect(gateway.remove(identifyMessageDto)).rejects.toThrow(
        removeMessageErrorMsg,
      );
    });
  });

  describe('joinRoom', () => {
    it('should return the identified client', async () => {
      // arrange
      const joinRoomDto: JoinRoomDto = { name: 'name', chatId: 'chatId' };
      const client: Partial<Socket> = { id: 'id' };
      const clientName = 'name';
      jest
        .spyOn(messagesService, 'identify')
        .mockResolvedValueOnce([clientName]);

      // act & assert
      await expect(
        gateway.joinRoom(joinRoomDto, client as Socket),
      ).resolves.toEqual([clientName]);
    });
    it('should throw an error if the client identification fails', async () => {
      // arrange
      const joinRoomDto: JoinRoomDto = { name: 'name', chatId: 'chatId' };
      const client: Partial<Socket> = { id: 'id' };
      const identifyErrorMsg = 'Failed to identify client';
      jest
        .spyOn(messagesService, 'identify')
        .mockRejectedValueOnce(new Error(identifyErrorMsg));

      // act & assert
      await expect(
        gateway.joinRoom(joinRoomDto, client as Socket),
      ).rejects.toThrow(identifyErrorMsg);
    });
  });

  describe('typing', () => {
    it('should emit a typing event', async () => {
      // arrange
      const typingDto: TypingDto = { isTyping: true, chatId: 'chatId' };
      const emitSpy = jest.fn();
      const broadcast = { emit: emitSpy } as any;
      const client: Partial<Socket> = {
        id: 'id',
        broadcast,
      };
      const name = 'name';
      jest.spyOn(messagesService, 'getClientName').mockResolvedValueOnce(name);

      // act
      await gateway.typing(typingDto, client as Socket);

      // assert
      expect(emitSpy).toHaveBeenCalledWith('typing', {
        name,
        isTyping: typingDto.isTyping,
      });
    });
    it('should throw an error if the client name retrieval fails', async () => {
      // arrange
      const typingDto: TypingDto = { isTyping: true, chatId: 'chatId' };
      const client: Partial<Socket> = { id: 'id' };
      const getClientNameErrorMsg = 'Failed to get client name';
      jest
        .spyOn(messagesService, 'getClientName')
        .mockRejectedValueOnce(new Error(getClientNameErrorMsg));

      // act & assert
      await expect(gateway.typing(typingDto, client as Socket)).rejects.toThrow(
        getClientNameErrorMsg,
      );
    });
  });
});
