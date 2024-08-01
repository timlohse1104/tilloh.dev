import { IdentifiersMongoDbService } from '@backend/memorandum/memorandum-persistence';
import { Test, TestingModule } from '@nestjs/testing';
import { IdentifiersService } from './identifier.service';

describe('IdentifiersService', () => {
  let service: IdentifiersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IdentifiersMongoDbService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        IdentifiersService,
      ],
    }).compile();

    service = module.get<IdentifiersService>(IdentifiersService);
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
