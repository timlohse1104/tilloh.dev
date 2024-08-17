import { KeystoreMongoDbService } from '@backend/shared-keystore-persistence';
import { mockKeystoreDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreController } from './keystore.controller';

describe('KeystoreController', () => {
  let controller: KeystoreController;
  let keystoreMongoDbServiceMock: KeystoreMongoDbService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('getKeys', () => {
    it('should return an array of keys', async () => {
      const mockKeys = [mockKeystoreDto({})];
      jest
        .spyOn(keystoreMongoDbServiceMock, 'findAll')
        .mockResolvedValue(mockKeys);

      const result = await controller.getKeys();

      expect(result).toEqual(mockKeys);
    });
  });

  describe('getKey', () => {
    it('should return a key', async () => {
      const mockKey = mockKeystoreDto({});
      jest
        .spyOn(keystoreMongoDbServiceMock, 'findOne')
        .mockResolvedValue(mockKey);

      const result = await controller.getKey({
        identifier: 'mock_identifier',
        key: 'mock_key',
      });

      expect(result).toEqual(mockKey);
    });
  });

  describe('createKey', () => {
    it('should create a key', async () => {
      const mockKey = mockKeystoreDto({});
      jest
        .spyOn(keystoreMongoDbServiceMock, 'create')
        .mockResolvedValue(mockKey);

      const result = await controller.createKey({
        identifier: 'mock_identifier',
        key: 'mock_key',
        value: 'mock_value',
      });

      expect(result).toEqual(mockKey);
    });
  });

  describe('updateKey', () => {
    it('should update a key', async () => {
      const mockKey = mockKeystoreDto({});
      jest
        .spyOn(keystoreMongoDbServiceMock, 'update')
        .mockResolvedValue(mockKey);

      const result = await controller.updateKey(
        { identifier: 'mock_identifier', key: 'mock_key' },
        { value: 'mock_value' },
      );

      expect(result).toEqual(mockKey);
    });
  });

  describe('deleteIdentifier', () => {
    it('should remove a key', async () => {
      const mockKey = mockKeystoreDto({});
      jest
        .spyOn(keystoreMongoDbServiceMock, 'remove')
        .mockResolvedValue(mockKey as never);

      const result = await controller.deleteIdentifier({
        identifier: 'mock_identifier',
        key: 'mock_key',
      });

      expect(result).toEqual(mockKey);
    });
  });
});
