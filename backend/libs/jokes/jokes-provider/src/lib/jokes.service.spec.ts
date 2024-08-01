import { JokesMongoDbService } from '@backend/jokes/jokes-persistence';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { JokesService } from './jokes.service';

describe('JokesService', () => {
  let service: JokesService;
  let jokesMongoDbServiceMock: JokesMongoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JokesMongoDbService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        JokesService,
      ],
    }).compile();

    service = module.get<JokesService>(JokesService);
    jokesMongoDbServiceMock =
      module.get<JokesMongoDbService>(JokesMongoDbService);
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
