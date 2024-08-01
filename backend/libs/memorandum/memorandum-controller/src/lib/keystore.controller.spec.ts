import { KeystoreMongoDbService } from '@backend/shared-keystore-persistence';
import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreController } from './keystore.controller';

describe('KeystoreController', () => {
  let controller: KeystoreController;
  let keystoreMongoDbServiceMock: KeystoreMongoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KeystoreMongoDbService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
      controllers: [KeystoreController],
    }).compile();

    controller = module.get<KeystoreController>(KeystoreController);
    keystoreMongoDbServiceMock = module.get<KeystoreMongoDbService>(
      KeystoreMongoDbService,
    );
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('test', () => {
    it('should return true', async () => {
      // arrange

      // act & assert
      expect(true).toBe(true);
    });
  });
});
