import { IdentifiersMongoDbService } from '@backend/memorandum/memorandum-persistence';
import { mockIdentifierDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { IdentifiersService } from './identifier.service';

describe('IdentifiersService', () => {
  let service: IdentifiersService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

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

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('listIdentifiers', () => {
    it('should list all identifiers', async () => {
      // arrange
      const expectedIdentifiers = [
        mockIdentifierDto({ _id: '1', name: 'identifier1' }),
        mockIdentifierDto({ _id: '2', name: 'identifier2' }),
      ];
      jest
        .spyOn(service, 'listIdentifiers')
        .mockResolvedValue(expectedIdentifiers);

      // act
      const identifiers = await service.listIdentifiers();

      // assert
      expect(identifiers).toEqual(expectedIdentifiers);
    });
  });

  describe('getIdentifier', () => {
    it('should get an identifier', async () => {
      // arrange
      const identifier = mockIdentifierDto({ _id: '1', name: 'identifier1' });
      jest.spyOn(service, 'getIdentifier').mockResolvedValue(identifier);

      // act
      const result = await service.getIdentifier({ id: '1' });

      // assert
      expect(result).toEqual(identifier);
    });
  });

  describe('createIdentifier', () => {
    it('should create an identifier', async () => {
      // arrange
      const identifier = mockIdentifierDto({ _id: '1', name: 'identifier1' });
      jest.spyOn(service, 'createIdentifier').mockResolvedValue(identifier);

      // act
      const result = await service.createIdentifier({ name: 'identifier1' });

      // assert
      expect(result).toEqual(identifier);
    });
  });

  describe('updateIdentifier', () => {
    it('should update an identifier', async () => {
      // arrange
      const identifier = mockIdentifierDto({ _id: '1', name: 'identifier1' });
      jest.spyOn(service, 'updateIdentifier').mockResolvedValue(identifier);

      // act
      const result = await service.updateIdentifier('1', identifier);

      // assert
      expect(result).toEqual(identifier);
    });
  });

  describe('deleteIdentifier', () => {
    it('should delete an identifier', async () => {
      // arrange
      const identifier = mockIdentifierDto({ _id: '1', name: 'identifier1' });
      jest.spyOn(service, 'deleteIdentifier').mockResolvedValue(identifier);

      // act
      const result = await service.deleteIdentifier('1');

      // assert
      expect(result).toEqual(identifier);
    });
  });
});
