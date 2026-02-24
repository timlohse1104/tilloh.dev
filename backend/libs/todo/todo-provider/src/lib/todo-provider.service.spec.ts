import {
  CreateSharedTodoListInputDto,
  GetSharedTodoListInputDto,
  RemoveSharedTodoListInputDto,
  UpdateSharedTodoListInputDto,
} from '@backend/shared-types';
import { TodoPersistenceService } from '@backend/todo-persistence';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoProviderService } from './todo-provider.service';

describe('TodoProviderService', () => {
  let service: TodoProviderService;
  let persistenceService: TodoPersistenceService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TodoPersistenceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        TodoProviderService,
      ],
    }).compile();

    service = module.get<TodoProviderService>(TodoProviderService);
    persistenceService = module.get<TodoPersistenceService>(
      TodoPersistenceService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined.', () => {
    expect(service).toBeDefined();
  });

  describe('listSharedTodoLists', () => {
    it('should return a list of all shared todo lists', async () => {
      // arrange
      const expectedLists = [
        mockTodoList,
        { ...mockTodoList, _id: 'mock-id-456' },
      ];
      jest
        .spyOn(persistenceService, 'findAll')
        .mockResolvedValue(expectedLists as any);

      // act
      const result = await service.listSharedTodoLists();

      // assert
      expect(result).toEqual(expectedLists);
      expect(persistenceService.findAll).toHaveBeenCalled();
    });

    it('should pass filter to persistence service', async () => {
      // arrange
      const filter = { name: 'Test' };
      jest.spyOn(persistenceService, 'findAll').mockResolvedValue([]);

      // act
      await service.listSharedTodoLists(filter);

      // assert
      expect(persistenceService.findAll).toHaveBeenCalled();
    });

    it('should throw an error if listing fails', async () => {
      // arrange
      const errorMsg = 'Failed to list todos';
      jest
        .spyOn(persistenceService, 'findAll')
        .mockRejectedValue(new Error(errorMsg));

      // act & assert
      await expect(service.listSharedTodoLists()).rejects.toThrow(errorMsg);
    });
  });

  describe('getSharedTodoList', () => {
    it('should return a single shared todo list by id', async () => {
      // arrange
      const input: GetSharedTodoListInputDto = { id: 'mock-id-123' };
      jest
        .spyOn(persistenceService, 'findOne')
        .mockResolvedValue(mockTodoList as any);

      // act
      const result = await service.getSharedTodoList(input);

      // assert
      expect(result).toEqual(mockTodoList);
      expect(persistenceService.findOne).toHaveBeenCalledWith(input.id);
    });

    it('should throw NotFoundException when list not found', async () => {
      // arrange
      const input: GetSharedTodoListInputDto = { id: 'non-existent-id' };
      jest.spyOn(persistenceService, 'findOne').mockResolvedValue(null);

      // act & assert
      await expect(service.getSharedTodoList(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getSharedTodoList(input)).rejects.toThrow(
        `Shared todo list with id ${input.id} not found`,
      );
    });

    it('should throw an error if retrieval fails', async () => {
      // arrange
      const input: GetSharedTodoListInputDto = { id: 'mock-id-123' };
      const errorMsg = 'Failed to get todo';
      jest
        .spyOn(persistenceService, 'findOne')
        .mockRejectedValue(new Error(errorMsg));

      // act & assert
      await expect(service.getSharedTodoList(input)).rejects.toThrow(errorMsg);
    });
  });

  describe('createSharedTodoList', () => {
    it('should create a new shared todo list', async () => {
      // arrange
      const input: CreateSharedTodoListInputDto = {
        name: 'New List',
        emoji: '✨',
      };
      const expectedList = {
        ...mockTodoList,
        name: input.name,
        emoji: input.emoji,
        todos: [],
        history: [],
      };
      jest
        .spyOn(persistenceService, 'create')
        .mockResolvedValue(expectedList as any);

      // act
      const result = await service.createSharedTodoList(input);

      // assert
      expect(result).toEqual(expectedList);
      expect(persistenceService.create).toHaveBeenCalledWith(
        input.name,
        input.emoji,
      );
    });

    it('should throw an error if creation fails', async () => {
      // arrange
      const input: CreateSharedTodoListInputDto = {
        name: 'New List',
        emoji: '✨',
      };
      const errorMsg = 'Failed to create todo';
      jest
        .spyOn(persistenceService, 'create')
        .mockRejectedValue(new Error(errorMsg));

      // act & assert
      await expect(service.createSharedTodoList(input)).rejects.toThrow(
        errorMsg,
      );
    });
  });

  describe('updateSharedTodoList', () => {
    it('should update a shared todo list', async () => {
      // arrange
      const input: UpdateSharedTodoListInputDto = {
        id: 'mock-id-123',
        name: 'Updated List',
        emoji: '🔄',
        todos: [
          {
            id: 'todo-1',
            title: 'Updated Todo',
            done: true,
            amount: '2x',
            category: 'Updated',
          },
        ],
        history: ['Updated Todo'],
        version: 1,
      };
      const expectedList = {
        ...mockTodoList,
        ...input,
        version: 2,
      };
      jest
        .spyOn(persistenceService, 'update')
        .mockResolvedValue(expectedList as any);

      // act
      const result = await service.updateSharedTodoList(input);

      // assert
      expect(result).toEqual(expectedList);
      expect(persistenceService.update).toHaveBeenCalledWith(
        input.id,
        input.name,
        input.emoji,
        input.todos,
        input.history,
        input.version,
      );
    });

    it('should handle missing history field', async () => {
      // arrange
      const input: UpdateSharedTodoListInputDto = {
        id: 'mock-id-123',
        name: 'Updated List',
        emoji: '🔄',
        todos: [],
        version: 1,
      };
      jest
        .spyOn(persistenceService, 'update')
        .mockResolvedValue(mockTodoList as any);

      // act
      await service.updateSharedTodoList(input);

      // assert
      expect(persistenceService.update).toHaveBeenCalledWith(
        input.id,
        input.name,
        input.emoji,
        input.todos,
        [],
        input.version,
      );
    });

    it('should throw an error if update fails', async () => {
      // arrange
      const input: UpdateSharedTodoListInputDto = {
        id: 'mock-id-123',
        name: 'Updated List',
        emoji: '🔄',
        todos: [],
        history: [],
        version: 1,
      };
      const errorMsg = 'Failed to update todo';
      jest
        .spyOn(persistenceService, 'update')
        .mockRejectedValue(new Error(errorMsg));

      // act & assert
      await expect(service.updateSharedTodoList(input)).rejects.toThrow(
        errorMsg,
      );
    });
  });

  describe('removeSharedTodoList', () => {
    it('should remove a shared todo list', async () => {
      // arrange
      const input: RemoveSharedTodoListInputDto = { id: 'mock-id-123' };
      jest
        .spyOn(persistenceService, 'remove')
        .mockResolvedValue(mockTodoList as any);

      // act
      const result = await service.removeSharedTodoList(input);

      // assert
      expect(result).toEqual(mockTodoList);
      expect(persistenceService.remove).toHaveBeenCalledWith(input.id);
    });

    it('should throw NotFoundException when list to remove not found', async () => {
      // arrange
      const input: RemoveSharedTodoListInputDto = { id: 'non-existent-id' };
      jest.spyOn(persistenceService, 'remove').mockResolvedValue(null);

      // act & assert
      await expect(service.removeSharedTodoList(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.removeSharedTodoList(input)).rejects.toThrow(
        `Shared todo list with id ${input.id} not found`,
      );
    });

    it('should throw an error if removal fails', async () => {
      // arrange
      const input: RemoveSharedTodoListInputDto = { id: 'mock-id-123' };
      const errorMsg = 'Failed to remove todo';
      jest
        .spyOn(persistenceService, 'remove')
        .mockRejectedValue(new Error(errorMsg));

      // act & assert
      await expect(service.removeSharedTodoList(input)).rejects.toThrow(
        errorMsg,
      );
    });
  });
});
