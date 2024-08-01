import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { Keystore } from './schema/keystore.schema';

describe('KeystoreMongoDbService', () => {
  let service: KeystoreMongoDbService;

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
