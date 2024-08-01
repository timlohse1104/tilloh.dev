import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
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
        MessagesService,
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    chatMongoDbServiceMock = module.get<ChatMongoDbService>(ChatMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
