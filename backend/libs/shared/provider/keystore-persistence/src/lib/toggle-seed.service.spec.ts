import { mockKeystoreDto } from '@backend/util';
import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreMongoDbService } from './keystore-mongodb.service';
import { TOGGLE_IDENTIFIER, TOGGLE_SEED_CONFIG } from './toggle-seed.config';
import { ToggleSeedService } from './toggle-seed.service';

describe('ToggleSeedService', () => {
  let service: ToggleSeedService;
  let keystoreService: jest.Mocked<KeystoreMongoDbService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToggleSeedService,
        {
          provide: KeystoreMongoDbService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ToggleSeedService>(ToggleSeedService);
    keystoreService = module.get(KeystoreMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should create all toggles when DB is empty', async () => {
      // arrange
      keystoreService.findAll.mockResolvedValue([]);
      keystoreService.create.mockResolvedValue(
        mockKeystoreDto({ identifier: TOGGLE_IDENTIFIER }),
      );

      // act
      await service.onApplicationBootstrap();

      // assert
      expect(keystoreService.findAll).toHaveBeenCalledWith({
        identifier: TOGGLE_IDENTIFIER,
      });
      expect(keystoreService.create).toHaveBeenCalledTimes(
        TOGGLE_SEED_CONFIG.length,
      );
    });

    it('should not create any toggles when all already exist', async () => {
      // arrange
      const existingToggles = TOGGLE_SEED_CONFIG.map((entry) =>
        mockKeystoreDto({ identifier: TOGGLE_IDENTIFIER, key: entry.key }),
      );
      keystoreService.findAll.mockResolvedValue(existingToggles);

      // act
      await service.onApplicationBootstrap();

      // assert
      expect(keystoreService.create).not.toHaveBeenCalled();
    });

    it('should only create missing toggles when DB is partially populated', async () => {
      // arrange
      const existingKeys = TOGGLE_SEED_CONFIG.slice(0, 5);
      const existingToggles = existingKeys.map((entry) =>
        mockKeystoreDto({ identifier: TOGGLE_IDENTIFIER, key: entry.key }),
      );
      keystoreService.findAll.mockResolvedValue(existingToggles);
      keystoreService.create.mockResolvedValue(
        mockKeystoreDto({ identifier: TOGGLE_IDENTIFIER }),
      );

      // act
      await service.onApplicationBootstrap();

      // assert
      expect(keystoreService.create).toHaveBeenCalledTimes(
        TOGGLE_SEED_CONFIG.length - existingKeys.length,
      );
    });

    it('should continue seeding remaining toggles when one create fails', async () => {
      // arrange
      keystoreService.findAll.mockResolvedValue([]);
      keystoreService.create
        .mockRejectedValueOnce(new Error('create failed'))
        .mockResolvedValue(
          mockKeystoreDto({ identifier: TOGGLE_IDENTIFIER }),
        );

      // act
      await service.onApplicationBootstrap();

      // assert
      expect(keystoreService.create).toHaveBeenCalledTimes(
        TOGGLE_SEED_CONFIG.length,
      );
    });
  });
});
