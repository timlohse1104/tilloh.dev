import { ListsMongoDbService } from '@backend/lists/lists-persistence';
import { mockListDto } from '@backend/util';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ListsService } from './lists.service';

describe('ListsService', () => {
  let service: ListsService;
  let listsMongoDbServiceMock: ListsMongoDbService;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListsMongoDbService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        ListsService,
      ],
    }).compile();

    service = module.get<ListsService>(ListsService);
    listsMongoDbServiceMock =
      module.get<ListsMongoDbService>(ListsMongoDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('getLists', () => {
    it('should list all lists', async () => {
      // arrange
      const lists = [
        mockListDto({ name: 'list1' }),
        mockListDto({ name: 'list2' }),
      ];
      jest.spyOn(listsMongoDbServiceMock, 'findAll').mockResolvedValue(lists);

      // act
      const result = await service.getLists();

      // assert
      expect(result).toEqual(lists);
    });
  });

  describe('getList', () => {
    it('should get a list by id', async () => {
      // arrange
      const list = mockListDto({ name: 'list1' });
      jest.spyOn(listsMongoDbServiceMock, 'findOne').mockResolvedValue(list);

      // act
      const result = await service.getList('id');

      // assert
      expect(result).toEqual(list);
    });
  });

  describe('createList', () => {
    it('should create a list', async () => {
      // arrange
      const list = mockListDto({ name: 'list1' });
      jest.spyOn(listsMongoDbServiceMock, 'create').mockResolvedValue(list);

      // act
      const result = await service.createList({ ...list, history: [] });

      // assert
      expect(result).toEqual(list);
    });
  });

  describe('updateList', () => {
    it('should update a list', async () => {
      // arrange
      const list = mockListDto({ name: 'list1' });
      jest.spyOn(listsMongoDbServiceMock, 'update').mockResolvedValue(list);

      // act
      const result = await service.updateList('id', list);

      // assert
      expect(result).toEqual(list);
    });
  });

  describe('removeList', () => {
    it('should remove a list', async () => {
      // arrange

      // act
      await service.deleteList('id');

      // assert
      expect(listsMongoDbServiceMock.remove).toHaveBeenCalledWith('id');
    });
  });
});
