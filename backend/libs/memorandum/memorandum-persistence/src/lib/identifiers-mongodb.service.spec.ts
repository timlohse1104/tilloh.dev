import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IdentifiersMongoDbService } from './identifiers-mongodb.service';
import { Identifier } from './schema/identifiers.schema';

describe('IdentifiersMongoDbService', () => {
  let service: IdentifiersMongoDbService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Identifier.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        IdentifiersMongoDbService,
      ],
    }).compile();

    service = module.get<IdentifiersMongoDbService>(IdentifiersMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
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
