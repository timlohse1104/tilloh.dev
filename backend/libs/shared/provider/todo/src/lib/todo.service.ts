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
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Filter } from 'mongodb';
import { TodoMongoDbService } from './todo-mongodb.service';
import { SharedTodoListDocument } from './schema/todo.schema';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  constructor(private todoMongoDbService: TodoMongoDbService) {}

  /**
   * Fetches all shared todo lists.
   *
   * @param filter Optional param to filter for specific shared todo list results.
   * @returns An array of shared todo list objects.
   */
  async listSharedTodoLists(
    filter: Filter<SharedTodoListDocument> = {},
  ): Promise<GetSharedTodoListsOutputDto[]> {
    this.logger.log('Return a list of all shared todo lists.');
    return (await this.todoMongoDbService.findAll()) as any;
  }

  /**
   * Fetches a shared todo list by its id.
   *
   * @param getSharedTodoListInput The id of the shared todo list.
   * @returns A single shared todo list object.
   */
  async getSharedTodoList(
    getSharedTodoListInput: GetSharedTodoListInputDto,
  ): Promise<GetSharedTodoListOutputDto> {
    this.logger.log('Returns a single shared todo list.');
    const result = await this.todoMongoDbService.findOne(
      getSharedTodoListInput.id,
    );
    if (!result) {
      throw new NotFoundException(
        `Shared todo list with id ${getSharedTodoListInput.id} not found`,
      );
    }
    return result as any;
  }

  /**
   * Creates a shared todo list.
   *
   * @param createSharedTodoListInputDto The name and emoji of the shared todo list.
   * @returns The created shared todo list object.
   */
  async createSharedTodoList(
    createSharedTodoListInputDto: CreateSharedTodoListInputDto,
  ): Promise<CreateSharedTodoListOutputDto> {
    this.logger.log('Creates a new shared todo list.');
    return (await this.todoMongoDbService.create(
      createSharedTodoListInputDto.name,
      createSharedTodoListInputDto.emoji,
    )) as any;
  }

  /**
   * Updates a shared todo list.
   *
   * @param updateSharedTodoListInputDto The shared todo list data to update.
   * @returns The updated shared todo list object.
   */
  async updateSharedTodoList(
    updateSharedTodoListInputDto: UpdateSharedTodoListInputDto,
  ): Promise<UpdateSharedTodoListOutputDto> {
    this.logger.log('Updates a shared todo list.');
    return (await this.todoMongoDbService.update(
      updateSharedTodoListInputDto.id,
      updateSharedTodoListInputDto.name,
      updateSharedTodoListInputDto.emoji,
      updateSharedTodoListInputDto.todos,
      updateSharedTodoListInputDto.history || [],
      updateSharedTodoListInputDto.version,
    )) as any;
  }

  /**
   * Removes a shared todo list.
   *
   * @param removeSharedTodoListInputDto The id of the shared todo list to remove.
   * @returns The removed shared todo list object.
   */
  async removeSharedTodoList(
    removeSharedTodoListInputDto: RemoveSharedTodoListInputDto,
  ): Promise<RemoveSharedTodoListOutputDto> {
    this.logger.log('Removes a shared todo list.');
    const result = await this.todoMongoDbService.remove(
      removeSharedTodoListInputDto.id,
    );
    if (!result) {
      throw new NotFoundException(
        `Shared todo list with id ${removeSharedTodoListInputDto.id} not found`,
      );
    }
    return result as any;
  }
}
