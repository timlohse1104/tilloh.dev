import { IdentifierDto } from '@backend/shared-types';
import { mockIdentifierDto } from '@backend/util';
import { getModelToken } from 'npm:@nestjs/mongoose';
import { Test, TestingModule } from 'npm:@nestjs/testing';
import { Document, Model } from 'npm:mongoose';
import { IdentifiersMongoDbService } from './identifiers-mongodb.service';
import { Identifier, IdentifierDocument } from './schema/identifiers.schema';

describe('IdentifiersMongoDbService', () => {
  let service: IdentifiersMongoDbService;
  let identifierModel: Model<IdentifierDocument>;

  const mockIdentifierDocument = (
    mock: Partial<IdentifierDto>,
  ): Partial<Document<IdentifierDto>> => ({
    toObject: jest.fn().mockReturnValue(mockIdentifierDto(mock)),
  });

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
    identifierModel = module.get<Model<IdentifierDocument>>(
      getModelToken(Identifier.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all identifiers', async () => {
      // arrange
      const expectedIdentifiers: Partial<IdentifierDto>[] = [
        mockIdentifierDto({ _id: '1', name: 'identifier1' }),
        mockIdentifierDto({ _id: '2', name: 'identifier2' }),
      ];
      const result: Document<IdentifierDto>[] = [
        mockIdentifierDocument({
          _id: '1',
          name: 'identifier1',
        }) as Document<IdentifierDto>,
        mockIdentifierDocument({
          _id: '2',
          name: 'identifier2',
        }) as Document<IdentifierDto>,
      ];
      jest.spyOn(identifierModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.findAll()).toEqual(expectedIdentifiers);
    });
    it('should return empty array when no identifiers found', async () => {
      // arrange
      jest.spyOn(identifierModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as never);

      // act & assert
      expect(await service.findAll()).toEqual([]);
    });

    it('should throw an error when finding all identifiers fails', async () => {
      // arrange
      const findAllIdentifiersErrorMsg = 'Failed to find identifiers';
      jest.spyOn(identifierModel, 'find').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error(findAllIdentifiersErrorMsg)),
      } as never);

      // act & assert
      await expect(service.findAll()).rejects.toThrow(
        findAllIdentifiersErrorMsg,
      );
    });
  });

  describe('findOne', () => {
    it('should find an identifier by id', async () => {
      // arrange
      const identifierId = '1';
      const expectedIdentifier = mockIdentifierDto({
        _id: identifierId,
        name: 'identifier1',
      });
      const result = mockIdentifierDocument({
        _id: identifierId,
        name: 'identifier1',
      }) as Document<IdentifierDto>;
      jest.spyOn(identifierModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.findOne(identifierId)).toEqual(expectedIdentifier);
    });

    it('should throw an error when finding an identifier by id fails', async () => {
      // arrange
      const identifierId = '1';
      const findIdentifierErrorMsg = 'Failed to find identifier';
      jest.spyOn(identifierModel, 'findOne').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error(findIdentifierErrorMsg)),
      } as never);

      // act & assert
      await expect(service.findOne(identifierId)).rejects.toThrow(
        findIdentifierErrorMsg,
      );
    });
  });

  describe('create', () => {
    it('should create an identifier', async () => {
      // arrange
      const identifierName = 'identifier1';
      const expectedIdentifier = mockIdentifierDto({
        _id: '1',
        name: identifierName,
      });
      const result = mockIdentifierDocument({
        _id: '1',
        name: identifierName,
      }) as Document<IdentifierDto>;
      jest.spyOn(identifierModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.create(identifierName)).toEqual(expectedIdentifier);
    });

    it('should throw an error when creating an identifier fails', async () => {
      // arrange
      const identifierName = 'identifier1';
      const createIdentifierErrorMsg = 'Failed to create identifier';
      jest.spyOn(identifierModel, 'create').mockReturnValueOnce({
        save: jest
          .fn()
          .mockRejectedValueOnce(new Error(createIdentifierErrorMsg)),
      } as never);

      // act & assert
      await expect(service.create(identifierName)).rejects.toThrow(
        createIdentifierErrorMsg,
      );
    });
  });

  describe('update', () => {
    it('should update an identifier', async () => {
      // arrange
      const identifierId = '1';
      const identifierName = 'identifier1';
      const expectedIdentifier = mockIdentifierDto({
        _id: identifierId,
        name: identifierName,
      });
      const result = mockIdentifierDocument({
        _id: identifierId,
        name: identifierName,
      }) as Document<IdentifierDto>;
      jest.spyOn(identifierModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(
        await service.update(identifierId, { name: identifierName }),
      ).toEqual(expectedIdentifier);
    });

    it('should throw an error when updating an identifier fails', async () => {
      // arrange
      const identifierId = '1';
      const updateIdentifierErrorMsg = 'Failed to update identifier';
      jest.spyOn(identifierModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error(updateIdentifierErrorMsg)),
      } as never);

      // act & assert
      await expect(
        service.update(identifierId, { name: 'identifier1' }),
      ).rejects.toThrow(updateIdentifierErrorMsg);
    });
  });

  describe('remove', () => {
    it('should remove an identifier', async () => {
      // arrange
      const identifierId = '1';
      const expectedIdentifier = mockIdentifierDto({
        _id: identifierId,
        name: 'identifier1',
      });
      const result = mockIdentifierDocument({
        _id: identifierId,
        name: 'identifier1',
      }) as Document<IdentifierDto>;
      jest.spyOn(identifierModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      expect(await service.remove(identifierId)).toEqual(expectedIdentifier);
    });

    it('should throw an error when removing an identifier fails', async () => {
      // arrange
      const identifierId = '1';
      const removeIdentifierErrorMsg = 'Failed to remove identifier';
      jest.spyOn(identifierModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error(removeIdentifierErrorMsg)),
      } as never);

      // act & assert
      await expect(service.remove(identifierId)).rejects.toThrow(
        removeIdentifierErrorMsg,
      );
    });
  });
});
