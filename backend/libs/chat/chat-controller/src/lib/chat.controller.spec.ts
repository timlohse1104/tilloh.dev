import { ChatService } from '@backend/chat/chat-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';

describe('ChatController', () => {
  let controller: ChatController;

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
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
