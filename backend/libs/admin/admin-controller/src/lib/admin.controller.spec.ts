import { AdminService } from '@backend/admin-provider';
import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

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
      const inputVerifyAdmin: InputVerifyAdmin = { id: '1' };
      const outputVerifyAdmin: OutputVerifyAdmin = { isAdmin: true };
      jest
        .spyOn(adminService, 'verifyAdmin')
        .mockResolvedValue(outputVerifyAdmin);

      // Act and Assert
      await expect(controller.verifyAdmin(inputVerifyAdmin)).resolves.toEqual(
        outputVerifyAdmin,
      );
    });
  });
});
