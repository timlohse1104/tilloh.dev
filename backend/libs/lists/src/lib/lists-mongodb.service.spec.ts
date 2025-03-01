import { ListDto } from '@backend/shared-types';
import { mockListDto } from '@backend/util';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { ListsMongoDbService } from './lists-mongodb.service';
import { List, ListDocument } from './schema/lists.schema';

describe('ListsMongoDbService', () => {
  let service: ListsMongoDbService;
  let listModel: Model<ListDocument>;

  const mockListDocument = (
    mock: Partial<ListDto>,
  ): Partial<Document<ListDto>> => ({
    toObject: jest.fn().mockReturnValue(mockListDto(mock)),
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(List.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        ListsMongoDbService,
      ],
    }).compile();

    service = module.get<ListsMongoDbService>(ListsMongoDbService);
    listModel = module.get<Model<ListDocument>>(getModelToken(List.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all lists', async () => {
      // arrange
      const expectedLists = [mockListDto({ name: 'list1' })];
      jest.spyOn(listModel, 'find').mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce([mockListDocument(expectedLists[0])]),
      } as never);

      // act & assert
      await expect(service.findAll()).resolves.toEqual(expectedLists);
    });
    it('should throw an error when lists find fails', async () => {
      // arrange
      jest.spyOn(listModel, 'find').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find a list by id', async () => {
      // arrange
      const expectedList = mockListDto({ name: 'list1' });
      jest.spyOn(listModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockListDocument(expectedList)),
      } as never);

      // act & assert
      await expect(service.findOne('id')).resolves.toEqual(expectedList);
    });
    it('should throw a not found exception when list is not found', async () => {
      // arrange
      jest.spyOn(listModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.findOne('id')).rejects.toThrow('List not found');
    });
    it('should throw an error when list find fails', async () => {
      // arrange
      jest.spyOn(listModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.findOne('id')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a list', async () => {
      // arrange
      const expectedList = mockListDto({ name: 'list1' });
      const result = mockListDocument(expectedList) as Document<ListDto>;
      jest.spyOn(listModel, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(result),
      } as never);

      // act & assert
      await expect(service.create(expectedList)).resolves.toEqual(expectedList);
    });
    it('should throw an error when list create fails', async () => {
      // arrange
      jest.spyOn(listModel, 'create').mockRejectedValueOnce(new Error());

      // act & assert
      await expect(service.create(mockListDto({}))).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a list', async () => {
      // arrange
      const expectedList = mockListDto({ name: 'list1' });
      jest.spyOn(listModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockListDocument(expectedList)),
      } as never);

      // act & assert
      await expect(service.update('id', expectedList)).resolves.toEqual(
        expectedList,
      );
    });
    it('should throw a not found exception when list is not found', async () => {
      // arrange
      jest.spyOn(listModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.update('id', mockListDto({}))).rejects.toThrow(
        'List not found',
      );
    });
    it('should throw an error when list update fails', async () => {
      // arrange
      jest.spyOn(listModel, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.update('id', mockListDto({}))).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a list', async () => {
      // arrange
      const expectedList = mockListDto({ name: 'list1' });
      jest.spyOn(listModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockListDocument(expectedList)),
      } as never);

      // act & assert
      await expect(service.remove('id')).resolves.toEqual(expectedList);
    });
    it('should throw a not found exception when list is not found', async () => {
      // arrange
      jest.spyOn(listModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as never);

      // act & assert
      await expect(service.remove('id')).rejects.toThrow('List not found');
    });
    it('should throw an error when list remove fails', async () => {
      // arrange
      jest.spyOn(listModel, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as never);

      // act & assert
      await expect(service.remove('id')).rejects.toThrow();
    });
  });
});
