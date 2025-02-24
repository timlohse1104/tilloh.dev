import {
  ListDocument,
  ListsMongoDbService,
} from '@backend/lists/lists-persistence';
import { ListDto } from '@backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);
  constructor(private listsMongoDbService: ListsMongoDbService) {}

  /**
   * Fetches all lists.
   *
   * @param filter Optional param to filter for specific list results.
   * @returns An array of lists.
   */
  async getLists(filter: FilterQuery<ListDocument> = {}): Promise<ListDto[]> {
    this.logger.log('Getting all lists.');
    return await this.listsMongoDbService.findAll(filter);
  }

  /**
   * Fetches a list by its id.
   *
   * @param id The id of the list.
   * @returns A single list.
   */
  async getList(id: string): Promise<ListDto> {
    this.logger.log('Getting a list by id.');
    return await this.listsMongoDbService.findOne(id);
  }

  /**
   * Creates a new list.
   *
   * @param listDto The list to create.
   * @returns The created list.
   */
  async createList(listDto: ListDto): Promise<ListDto> {
    this.logger.log('Creating a list.');
    return await this.listsMongoDbService.create(listDto);
  }

  /**
   * Updates a list by its id.
   *
   * @param id The id of the list.
   * @param listDto The list to update.
   * @returns The updated list.
   */
  async updateList(id: string, listDto: Partial<ListDto>): Promise<ListDto> {
    this.logger.log('Updating a list.');
    return await this.listsMongoDbService.update(id, listDto);
  }

  /**
   * Deletes a list by its id.
   *
   * @param id The id of the list.
   * @returns The deleted list.
   */
  async deleteList(id: string): Promise<ListDto> {
    this.logger.log('Deleting a list.');
    return await this.listsMongoDbService.remove(id);
  }
}
