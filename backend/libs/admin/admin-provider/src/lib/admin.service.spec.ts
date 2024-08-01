import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let configService: ConfigService;

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
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('Service should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('verifyAdmin', () => {
    it('should return true if admin id could be validated against admin identifier', async () => {
      // arrange
      const inputId = 'correctId';
      configService.get = jest.fn().mockReturnValue(inputId);

      // act & assert
      expect(service.verifyAdmin(inputId)).toEqual({ isAdmin: true });
    });
    it('should return false if admin id could not be validated against admin identifier', async () => {
      // arrange
      const inputId = 'wrongId';
      configService.get = jest.fn().mockReturnValue('correctId');

      // act & assert
      expect(service.verifyAdmin(inputId)).toEqual({ isAdmin: false });
    });
  });
});
