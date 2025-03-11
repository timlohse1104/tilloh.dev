import { KeystoreDto } from '@backend/shared-types';
import { mockKeystoreDto } from '@backend/util';
import { getModelToken } from 'npm:@nestjs/mongoose';
import { Test, TestingModule } from 'npm:@nestjs/testing';
import { Document, Model } from 'npm:mongoose';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { Keystore } from './schema/keystore.schema';

describe('KeystoreMongoDbService', () => {
  let service: KeystoreMongoDbService;
  let keystoreModel: Model<Keystore>;

  const mockKeystoreDocument = (
    mock: Partial<KeystoreDto>,
  ): Partial<Document<KeystoreDto>> => ({
    toObject: jest.fn().mockReturnValue(mockKeystoreDto(mock)),
  });

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
    keystoreModel = module.get<Model<Keystore>>(getModelToken(Keystore.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all keys', async () => {
      // arrange
      const expectedKeys = [
        mockKeystoreDto({ identifier: '1', key: 'key1' }),
        mockKeystoreDto({ identifier: '2', key: 'key2' }),
      ];
      jest.spyOn(keystoreModel, 'find').mockResolvedValue(expectedKeys);

      // act
      const keys = await service.findAll();

      // assert
      expect(keys).toEqual(expectedKeys);
    });
    it('should throw an error when jokes find fails', async () => {
      // arrange
      jest
        .spyOn(keystoreModel, 'find')
        .mockRejectedValue(new Error('find failed'));

      // act & assert
      await expect(service.findAll()).rejects.toThrow('find failed');
    });
  });

  describe('findOne', () => {
    it('should find a key', async () => {
      // arrange
      const expectedKey = mockKeystoreDto({ identifier: '1', key: 'key1' });
      jest.spyOn(keystoreModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(expectedKey),
      } as never);

      // act
      const key = await service.findOne('1', 'key1');

      // assert
      expect(key).toEqual(expectedKey);
    });
    it('should throw an error when key find fails', async () => {
      // arrange
      const findFailedErrorMsg = 'find failed';
      jest.spyOn(keystoreModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error(findFailedErrorMsg)),
      } as never);

      // act & assert
      await expect(service.findOne('1', 'key1')).rejects.toThrow(
        findFailedErrorMsg,
      );
    });
  });

  describe('create', () => {
    it('should create a key', async () => {
      // arrange
      const expectedKey = mockKeystoreDto({ identifier: '1', key: 'key1' });
      const result = mockKeystoreDocument(expectedKey) as Document<KeystoreDto>;
      jest.spyOn(keystoreModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act
      const key = await service.create('1', 'key1', 'value1');

      // assert
      expect(key).toEqual(expectedKey);
    });
    it('should throw an error when key creation fails', async () => {
      // arrange
      const createFailedErrorMsg = 'create failed';
      jest.spyOn(keystoreModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockRejectedValueOnce(new Error(createFailedErrorMsg)),
      } as never);

      // act & assert
      await expect(service.create('1', 'key1', 'value1')).rejects.toThrow(
        createFailedErrorMsg,
      );
    });
  });

  describe('update', () => {
    it('should update a key', async () => {
      // arrange
      const expectedKey = mockKeystoreDto({ identifier: '1', key: 'key1' });
      const result = mockKeystoreDocument(expectedKey) as Document<KeystoreDto>;
      jest.spyOn(keystoreModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.update('1', 'key1', { value: 'value1' })).toEqual(
        expectedKey,
      );
    });
    it('should throw an error when key update fails', async () => {
      // arrange
      const updateFailedErrorMsg = 'update failed';
      jest.spyOn(keystoreModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(updateFailedErrorMsg)),
      } as never);

      // act & assert
      await expect(
        service.update('1', 'key1', { value: 'value1' }),
      ).rejects.toThrow(updateFailedErrorMsg);
    });
  });

  describe('remove', () => {
    it('should remove a key', async () => {
      // arrange
      const expectedKey = mockKeystoreDto({ identifier: '1', key: 'key1' });
      jest.spyOn(keystoreModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(expectedKey),
      } as never);

      // act & assert
      expect(await service.remove('1', 'key1')).toEqual(expectedKey);
    });
    it('should throw an error when key remove fails', async () => {
      // arrange
      const removeFailedErrorMsg = 'remove failed';
      jest.spyOn(keystoreModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(removeFailedErrorMsg)),
      } as never);

      // act & assert
      await expect(service.remove('1', 'key1')).rejects.toThrow(
        removeFailedErrorMsg,
      );
    });
  });
});
