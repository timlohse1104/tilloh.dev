import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { SharedTodoList, SharedTodoListDocument } from './schema/todo.schema';
import { TodoPersistenceService } from './todo-persistence.service';

describe('TodoPersistenceService', () => {
  let service: TodoPersistenceService;
  let model: Model<SharedTodoListDocument>;

  const mockTodoList = {
    _id: 'mock-id-123',
    name: 'Test List',
    emoji: '📝',
    todos: [
      {
        id: 'todo-1',
        title: 'Test Todo',
        done: false,
        amount: '1x',
        category: 'Test',
      },
    ],
    history: ['Test Todo'],
    version: 1,
    created: new Date('2024-01-01'),
    updated: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockModel: any = jest.fn().mockImplementation((dto: any) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    }));
    mockModel.find = jest.fn();
    mockModel.findById = jest.fn();
    mockModel.findOneAndUpdate = jest.fn();
    mockModel.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(SharedTodoList.name),
          useValue: mockModel,
        },
        TodoPersistenceService,
      ],
    }).compile();

    service = module.get<TodoPersistenceService>(TodoPersistenceService);
    model = module.get<Model<SharedTodoListDocument>>(
      getModelToken(SharedTodoList.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all shared todo lists', async () => {
      // arrange
      const expectedLists = [
        mockTodoList,
        { ...mockTodoList, _id: 'mock-id-456' },
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(expectedLists),
      } as any);

      // act & assert
      await expect(service.findAll()).resolves.toEqual(expectedLists);
      expect(model.find).toHaveBeenCalledWith();
    });

    it('should return empty array when no lists found', async () => {
      // arrange
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any);

      // act & assert
      await expect(service.findAll()).resolves.toEqual([]);
    });

    it('should throw an error when finding all lists fails', async () => {
      // arrange
      const errorMsg = 'Failed to find lists';
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(errorMsg)),
      } as any);

      // act & assert
      await expect(service.findAll()).rejects.toThrow(errorMsg);
    });
  });

  describe('findOne', () => {
    it('should return a single shared todo list by id', async () => {
      // arrange
      const id = 'mock-id-123';
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockTodoList),
      } as any);

      // act & assert
      await expect(service.findOne(id)).resolves.toEqual(mockTodoList);
      expect(model.findById).toHaveBeenCalledWith(id);
    });

    it('should return null when list not found', async () => {
      // arrange
      const id = 'non-existent-id';
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      // act & assert
      await expect(service.findOne(id)).resolves.toBeNull();
    });

    it('should throw an error when finding by id fails', async () => {
      // arrange
      const id = 'mock-id-123';
      const errorMsg = 'Failed to find list';
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(errorMsg)),
      } as any);

      // act & assert
      await expect(service.findOne(id)).rejects.toThrow(errorMsg);
    });
  });

  describe('create', () => {
    it('should create a new shared todo list', async () => {
      // arrange
      const name = 'New List';
      const emoji = '✨';
      const newList = {
        ...mockTodoList,
        name,
        emoji,
        todos: [],
        history: [],
        version: 1,
      };
      const saveMock = jest.fn().mockResolvedValueOnce(newList);
      (model as any).mockImplementationOnce((dto: any) => ({
        ...dto,
        save: saveMock,
      }));

      // act
      const result = await service.create(name, emoji);

      // assert
      expect(result).toEqual(newList);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      // arrange
      const name = 'New List';
      const emoji = '✨';
      const errorMsg = 'Failed to create list';
      const saveMock = jest.fn().mockRejectedValueOnce(new Error(errorMsg));
      (model as any).mockImplementationOnce((dto: any) => ({
        ...dto,
        save: saveMock,
      }));

      // act & assert
      await expect(service.create(name, emoji)).rejects.toThrow(errorMsg);
    });
  });

  describe('update', () => {
    it('should update a shared todo list with optimistic locking', async () => {
      // arrange
      const id = 'mock-id-123';
      const name = 'Updated List';
      const emoji = '🔄';
      const todos = [{ id: 'todo-1', title: 'Updated Todo', done: true }];
      const history = ['Updated Todo'];
      const currentVersion = 1;
      const updatedList = {
        ...mockTodoList,
        name,
        emoji,
        todos,
        history,
        version: 2,
      };

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedList),
      } as any);

      // act
      const result = await service.update(
        id,
        name,
        emoji,
        todos,
        history,
        currentVersion,
      );

      // assert
      expect(result).toEqual(updatedList);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: id, version: currentVersion },
        {
          name,
          emoji,
          todos,
          history,
          version: currentVersion + 1,
          updated: expect.any(Date),
        },
        { new: true },
      );
    });

    it('should throw NotFoundException when list does not exist', async () => {
      // arrange
      const id = 'non-existent-id';
      const name = 'Updated List';
      const emoji = '🔄';
      const todos: any[] = [];
      const history: string[] = [];
      const currentVersion = 1;

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      // act & assert
      await expect(
        service.update(id, name, emoji, todos, history, currentVersion),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when version conflicts', async () => {
      // arrange
      const id = 'mock-id-123';
      const name = 'Updated List';
      const emoji = '🔄';
      const todos: any[] = [];
      const history: string[] = [];
      const currentVersion = 1;
      const existingList = { ...mockTodoList, version: 2 };

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingList),
      } as any);

      // act & assert
      await expect(
        service.update(id, name, emoji, todos, history, currentVersion),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an error when update operation fails', async () => {
      // arrange
      const id = 'mock-id-123';
      const name = 'Updated List';
      const emoji = '🔄';
      const todos: any[] = [];
      const history: string[] = [];
      const currentVersion = 1;
      const errorMsg = 'Failed to update list';

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(errorMsg)),
      } as any);

      // act & assert
      await expect(
        service.update(id, name, emoji, todos, history, currentVersion),
      ).rejects.toThrow(errorMsg);
    });
  });

  describe('remove', () => {
    it('should remove a shared todo list by id', async () => {
      // arrange
      const id = 'mock-id-123';
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockTodoList),
      } as any);

      // act & assert
      await expect(service.remove(id)).resolves.toEqual(mockTodoList);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should return null when list to remove is not found', async () => {
      // arrange
      const id = 'non-existent-id';
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      // act & assert
      await expect(service.remove(id)).resolves.toBeNull();
    });

    it('should throw an error when removal fails', async () => {
      // arrange
      const id = 'mock-id-123';
      const errorMsg = 'Failed to remove list';
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error(errorMsg)),
      } as any);

      // act & assert
      await expect(service.remove(id)).rejects.toThrow(errorMsg);
    });
  });
});
