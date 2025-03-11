import { IdentifiersService } from '@backend/shared-identifiers';
import { mockIdentifierDto } from '@backend/util';
import { Test, TestingModule } from 'npm:@nestjs/testing';
import { IdentifiersController } from './identifiers.controller';

describe('IdentifiersController', () => {
  let controller: IdentifiersController;
  let identifiersServiceMock: IdentifiersService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IdentifiersService,
          useValue: {
            listIdentifiers: jest.fn(),
            getIdentifier: jest.fn(),
            createIdentifier: jest.fn(),
            updateIdentifier: jest.fn(),
            deleteIdentifier: jest.fn(),
          },
        },
      ],
      controllers: [IdentifiersController],
    }).compile();

    controller = module.get<IdentifiersController>(IdentifiersController);
    identifiersServiceMock = module.get<IdentifiersService>(IdentifiersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('getIdentifiers', () => {
    it('should return an array of identifiers', async () => {
      const mockIdentifiers = [mockIdentifierDto({})];
      jest
        .spyOn(identifiersServiceMock, 'listIdentifiers')
        .mockResolvedValue(mockIdentifiers);

      const result = await controller.getIdentifiers();

      expect(result).toEqual(mockIdentifiers);
    });
  });

  describe('getIdentifier', () => {
    it('should return an identifier', async () => {
      const mockIdentifier = mockIdentifierDto({});
      jest
        .spyOn(identifiersServiceMock, 'getIdentifier')
        .mockResolvedValue(mockIdentifier);

      const result = await controller.getIdentifier({ id: 'mock_id' });

      expect(result).toEqual(mockIdentifier);
    });
  });

  describe('createIdentifier', () => {
    it('should return an identifier', async () => {
      const mockIdentifier = mockIdentifierDto({});
      jest
        .spyOn(identifiersServiceMock, 'createIdentifier')
        .mockResolvedValue(mockIdentifier);

      const result = await controller.createIdentifier({ name: 'mock_name' });

      expect(result).toEqual(mockIdentifier);
    });
  });

  describe('updateIdentifier', () => {
    it('should return an identifier', async () => {
      const mockIdentifier = mockIdentifierDto({});
      jest
        .spyOn(identifiersServiceMock, 'updateIdentifier')
        .mockResolvedValue(mockIdentifier);

      const result = await controller.updateIdentifier(
        {
          id: 'mock_id',
        },
        {
          _id: 'mock_id',
          name: 'mock_name',
          created: new Date(),
          updated: new Date(),
        },
      );

      expect(result).toEqual(mockIdentifier);
    });
  });

  describe('deleteIdentifier', () => {
    it('should return an identifier', async () => {
      const mockIdentifier = mockIdentifierDto({});
      jest
        .spyOn(identifiersServiceMock, 'deleteIdentifier')
        .mockResolvedValue(mockIdentifier);

      const result = await controller.deleteIdentifier({ id: 'mock_id' });

      expect(result).toEqual(mockIdentifier);
    });
  });
});
