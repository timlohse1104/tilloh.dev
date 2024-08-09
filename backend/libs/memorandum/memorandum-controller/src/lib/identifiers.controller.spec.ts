import { IdentifiersService } from '@backend/memorandum/memorandum-provider';
import { Test, TestingModule } from '@nestjs/testing';
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

  describe('test', () => {
    it('should return true', async () => {
      // arrange

      // act & assert
      expect(true).toBe(true);
    });
  });
});
