import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            verifyAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('verfiyAdmin', () => {
    it('should return the output of verifing an admin', async () => {
      // Arrange
      const inputVerifyAdmin: InputVerifyAdmin = { id: '1', type: 'admin' };
      const outputVerifyAdmin: OutputVerifyAdmin = { isVerified: true };
      jest
        .spyOn(adminService, 'verifyAdmin')
        .mockResolvedValue(outputVerifyAdmin as never);

      // Act and Assert
      await expect(controller.verifyAdmin(inputVerifyAdmin)).resolves.toEqual(
        outputVerifyAdmin,
      );
    });
    it('should return the output of verifing a user', async () => {
      // Arrange
      const inputVerifyAdmin: InputVerifyAdmin = { id: '1', type: 'user' };
      const outputVerifyAdmin: OutputVerifyAdmin = { isVerified: false };
      jest
        .spyOn(adminService, 'verifyAdmin')
        .mockResolvedValue(outputVerifyAdmin as never);

      // Act and Assert
      await expect(controller.verifyAdmin(inputVerifyAdmin)).resolves.toEqual(
        outputVerifyAdmin,
      );
    });
  });
});
