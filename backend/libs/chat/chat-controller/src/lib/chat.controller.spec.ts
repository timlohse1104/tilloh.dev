import { ChatService } from '@backend/chat/chat-provider';
import {
  ChatEntityDto,
  CreateChatInputDto,
  GetChatInputDto,
  RemoveChatInputDto,
  UpdateChatInputDto,
} from '@backend/shared-types';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';

const mockChatEntityDto = (mock?: Partial<ChatEntityDto>): ChatEntityDto => {
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

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            listChats: jest.fn(),
            findChat: jest.fn(),
            createChat: jest.fn(),
            updateChat: jest.fn(),
            removeChat: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  describe('getChats', () => {
    it('should return the output of getting chats', async () => {
      // Arrange
      const chatEntityDto: ChatEntityDto[] = [mockChatEntityDto()];
      jest.spyOn(chatService, 'listChats').mockResolvedValue(chatEntityDto);

      // Act and Assert
      await expect(controller.getChats()).resolves.toEqual(chatEntityDto);
    });
  });

  describe('getChat', () => {
    it('should return the output of getting a chat', async () => {
      // Arrange
      const getChatInputDto: GetChatInputDto = { id: '1' };
      const outputGetChat: ChatEntityDto = mockChatEntityDto();
      jest.spyOn(chatService, 'findChat').mockResolvedValue(outputGetChat);

      // Act and Assert
      await expect(controller.getChat(getChatInputDto)).resolves.toEqual(
        outputGetChat,
      );
    });
  });

  describe('createChat', () => {
    it('should return the output of creating a chat', async () => {
      // Arrange
      const createChatInputDto: CreateChatInputDto = { name: 'test' };
      const outputCreateChat: ChatEntityDto = mockChatEntityDto({
        name: 'test',
      });
      jest.spyOn(chatService, 'createChat').mockResolvedValue(outputCreateChat);

      // Act and Assert
      await expect(controller.createChat(createChatInputDto)).resolves.toEqual(
        outputCreateChat,
      );
    });
  });

  describe('updateChat', () => {
    it('should return the output of updating a chat', async () => {
      // Arrange
      const updateChatInputParamDto: UpdateChatInputDto = { id: '1' };
      const updateChatInputBodyDto: ChatEntityDto = mockChatEntityDto({
        name: 'newName',
      });
      const outpuUpdateChat: ChatEntityDto = mockChatEntityDto({
        name: 'newName',
      });
      jest.spyOn(chatService, 'updateChat').mockResolvedValue(outpuUpdateChat);

      // Act and Assert
      await expect(
        controller.updateChat(updateChatInputParamDto, updateChatInputBodyDto),
      ).resolves.toEqual(outpuUpdateChat);
    });
  });

  describe('deleteChat', () => {
    it('should return the output of deleting a chat', async () => {
      // Arrange
      const removeChatInputDto: RemoveChatInputDto = { id: '1' };
      const outputDeleteChat: ChatEntityDto = mockChatEntityDto();
      jest.spyOn(chatService, 'removeChat').mockResolvedValue(outputDeleteChat);

      // Act and Assert
      await expect(controller.deleteChat(removeChatInputDto)).resolves.toEqual(
        outputDeleteChat,
      );
    });
  });
});
