import {
  ChatEntityDto,
  CreateChatInputDto,
  GetChatInputDto,
  RemoveChatInputDto,
  UpdateChatInputDto,
} from '@backend/shared-types';
import { mockChatEntityDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
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
