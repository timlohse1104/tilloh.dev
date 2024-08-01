import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JokesMongoDbService } from './jokes-mongodb.service';
import { Joke } from './schema/jokes.schema';

describe('JokesMongoDbService', () => {
  let service: JokesMongoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Joke.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        JokesMongoDbService,
      ],
    }).compile();

    service = module.get<JokesMongoDbService>(JokesMongoDbService);
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
