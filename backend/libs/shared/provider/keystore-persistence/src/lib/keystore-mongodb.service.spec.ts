import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { Keystore } from './schema/keystore.schema';

describe('KeystoreMongoDbService', () => {
  let service: KeystoreMongoDbService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Keystore.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        KeystoreMongoDbService,
      ],
    }).compile();

    service = module.get<KeystoreMongoDbService>(KeystoreMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  
});
