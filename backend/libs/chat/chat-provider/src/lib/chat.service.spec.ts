import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';

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

  it('Service should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('test', () => {
    it('should return true', async () => {
      // arrange

      // act & assert
      expect(true).toBe(true);
    });
  });
});
