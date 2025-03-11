import { IdentifiersService } from '@backend/shared-identifiers';
import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { ConfigService } from 'npm:@nestjs/config';
import { Test, TestingModule } from 'npm:@nestjs/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let configService: ConfigService;
  let identifiersService: IdentifiersService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminService],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: IdentifiersService,
          useValue: {
            getIdentifier: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    configService = module.get<ConfigService>(ConfigService);
    identifiersService = module.get<IdentifiersService>(IdentifiersService);
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('verifyAdmin', () => {
    it('should return true if admin id could be validated against admin identifier', async () => {
      // arrange
      const input: InputVerifyAdmin = { id: 'correctId', type: 'admin' };
      configService.get = jest.fn().mockReturnValue(input.id);
      const output: OutputVerifyAdmin = { isVerified: true };

      // act & assert
      await expect(service.verifyAdmin(input)).resolves.toEqual(output);
    });
    it('should return false if user id could not be validated', async () => {
      // arrange
      const input: InputVerifyAdmin = { id: 'falseId', type: 'user' };
      jest
        .spyOn(identifiersService, 'getIdentifier')
        .mockImplementationOnce(() => Promise.reject(new Error()));
      const output: OutputVerifyAdmin = { isVerified: false };

      // act & assert
      await expect(service.verifyAdmin(input)).resolves.toEqual(output);
    });
  });
});
