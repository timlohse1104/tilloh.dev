import { SharedIdentifiersService } from '@backend/shared-identifiers';
import { Test, TestingModule } from '@nestjs/testing';
import { IdentifiersController } from './identifiers.controller';

describe('IdentifiersController', () => {
  let controller: IdentifiersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SharedIdentifiersService,
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
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
