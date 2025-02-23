import { ListsService } from '@backend/lists/lists-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ListsController } from './lists.controller';

describe('ListsController', () => {
  let controller: ListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListsService,
          useValue: {
            getLists: jest.fn(),
            getList: jest.fn(),
            createList: jest.fn(),
            updateList: jest.fn(),
            deleteList: jest.fn(),
          },
        },
      ],
      controllers: [ListsController],
    }).compile();

    controller = module.get<ListsController>(ListsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
