import {
  CreateSharedTodoListInputDto,
  CreateSharedTodoListOutputDto,
  GetSharedTodoListInputDto,
  GetSharedTodoListOutputDto,
  GetSharedTodoListsOutputDto,
  RemoveSharedTodoListInputDto,
  RemoveSharedTodoListOutputDto,
  UpdateSharedTodoListInputDto,
  UpdateSharedTodoListOutputDto,
} from '@backend/shared-types';
import { TodoProviderService } from '@backend/todo-provider';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';

describe('TodoController', () => {
  let controller: TodoController;
  let todoProviderService: TodoProviderService;

  const mockSharedTodoList: GetSharedTodoListOutputDto = {
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
          provide: TodoProviderService,
          useValue: {
            listSharedTodoLists: jest.fn(),
            getSharedTodoList: jest.fn(),
            createSharedTodoList: jest.fn(),
            updateSharedTodoList: jest.fn(),
            removeSharedTodoList: jest.fn(),
          },
        },
      ],
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoProviderService = module.get<TodoProviderService>(TodoProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('getSharedTodoLists', () => {
    it('should return a list of shared todo lists.', async () => {
      // arrange
      const todoLists: GetSharedTodoListsOutputDto[] = [
        mockSharedTodoList,
        { ...mockSharedTodoList, _id: 'mock-id-456', name: 'Another List' },
      ];
      jest
        .spyOn(todoProviderService, 'listSharedTodoLists')
        .mockResolvedValue(todoLists as any);

      // act & assert
      await expect(controller.getSharedTodoLists()).resolves.toEqual(todoLists);
      expect(todoProviderService.listSharedTodoLists).toHaveBeenCalledWith({});
    });

    it('should pass filter query to service.', async () => {
      // arrange
      const filter = { name: 'Test' };
      const todoLists: GetSharedTodoListsOutputDto[] = [mockSharedTodoList];
      jest
        .spyOn(todoProviderService, 'listSharedTodoLists')
        .mockResolvedValue(todoLists as any);

      // act
      await controller.getSharedTodoLists(filter);

      // assert
      expect(todoProviderService.listSharedTodoLists).toHaveBeenCalledWith(
        filter,
      );
    });
  });

  describe('getSharedTodoList', () => {
    it('should return a single shared todo list.', async () => {
      // arrange
      const input: GetSharedTodoListInputDto = { id: 'mock-id-123' };
      jest
        .spyOn(todoProviderService, 'getSharedTodoList')
        .mockResolvedValue(mockSharedTodoList as any);

      // act & assert
      await expect(controller.getSharedTodoList(input)).resolves.toEqual(
        mockSharedTodoList,
      );
      expect(todoProviderService.getSharedTodoList).toHaveBeenCalledWith(input);
    });
  });

  describe('createSharedTodoList', () => {
    it('should create and return a new shared todo list.', async () => {
      // arrange
      const input: CreateSharedTodoListInputDto = {
        name: 'New List',
        emoji: '✨',
      };
      const output: CreateSharedTodoListOutputDto = {
        ...mockSharedTodoList,
        name: 'New List',
        emoji: '✨',
        todos: [],
        history: [],
        version: 0,
      };
      jest
        .spyOn(todoProviderService, 'createSharedTodoList')
        .mockResolvedValue(output as any);

      // act & assert
      await expect(controller.createSharedTodoList(input)).resolves.toEqual(
        output,
      );
      expect(todoProviderService.createSharedTodoList).toHaveBeenCalledWith(
        input,
      );
    });
  });

  describe('updateSharedTodoList', () => {
    it('should update and return the shared todo list.', async () => {
      // arrange
      const id = 'mock-id-123';
      const input: UpdateSharedTodoListInputDto = {
        id,
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
      const output: UpdateSharedTodoListOutputDto = {
        ...mockSharedTodoList,
        name: input.name,
        emoji: input.emoji,
        todos: input.todos,
        history: input.history,
        _id: id,
        version: 2,
      };
      jest
        .spyOn(todoProviderService, 'updateSharedTodoList')
        .mockResolvedValue(output as any);

      // act & assert
      await expect(controller.updateSharedTodoList(id, input)).resolves.toEqual(
        output,
      );
      expect(todoProviderService.updateSharedTodoList).toHaveBeenCalledWith({
        ...input,
        id,
      });
    });

    it('should merge id parameter with input dto.', async () => {
      // arrange
      const id = 'test-id-789';
      const input: UpdateSharedTodoListInputDto = {
        id,
        name: 'Test',
        emoji: '📋',
        todos: [],
        history: [],
        version: 5,
      };
      const mockOutput: UpdateSharedTodoListOutputDto = {
        _id: id,
        ...input,
        created: new Date('2024-01-01'),
        updated: new Date('2024-01-01'),
      };
      jest
        .spyOn(todoProviderService, 'updateSharedTodoList')
        .mockResolvedValue(mockOutput as any);

      // act
      await controller.updateSharedTodoList(id, input);

      // assert
      expect(todoProviderService.updateSharedTodoList).toHaveBeenCalledWith({
        ...input,
        id,
      });
    });
  });

  describe('removeSharedTodoList', () => {
    it('should remove and return the deleted shared todo list.', async () => {
      // arrange
      const input: RemoveSharedTodoListInputDto = { id: 'mock-id-123' };
      const output: RemoveSharedTodoListOutputDto = mockSharedTodoList;
      jest
        .spyOn(todoProviderService, 'removeSharedTodoList')
        .mockResolvedValue(output as any);

      // act & assert
      await expect(controller.removeSharedTodoList(input)).resolves.toEqual(
        output,
      );
      expect(todoProviderService.removeSharedTodoList).toHaveBeenCalledWith(
        input,
      );
    });
  });
});
