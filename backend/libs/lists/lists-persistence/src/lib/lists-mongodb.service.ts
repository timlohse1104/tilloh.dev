import { ListTexts } from '@backend/shared-texts';
import { ListDto } from '@backend/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { List, ListDocument } from './schema/lists.schema';

@Injectable()
export class ListsMongoDbService {
  private readonly logger = new Logger(ListsMongoDbService.name);

  constructor(
    @InjectModel(List.name)
    private listModel: Model<ListDocument>,
  ) {}

  /**
   * Fetches all lists from the mongodb collection 'lists'.
   *
   * @param filter Optional param to filter for specific list results.
   * @returns An array of list objects.
   */
  async findAll(filter: FilterQuery<ListDocument> = {}): Promise<ListDto[]> {
    this.logger.debug({ input: { filter } }, ListTexts.ATTEMPT_FIND_ALL);
    const lists = await this.listModel.find(filter).exec();
    this.logger.debug({ output: lists }, ListTexts.FOUND_ALL);
    return lists.map((list) => list.toObject());
  }

  /**
   * Fetches a list by its id from the mongodb collection 'lists'.
   *
   * @param id The id of the list.
   * @returns A single list object.
   */
  async findOne(id: string): Promise<ListDto> {
    this.logger.debug({ input: { id } }, ListTexts.ATTEMPT_FIND_ONE);
    const list = await this.listModel.findOne({ _id: id }).exec();

    if (!list) {
      throw new NotFoundException(ListTexts.NOT_FOUND);
    }
    this.logger.debug({ output: list }, ListTexts.FOUND_ONE);
    return list.toObject();
  }

  /**
   * Creates a new list in the mongodb collection 'lists'.
   *
   * @param createListDto The list to create.
   * @returns The created list object.
   */
  async create(createListDto: Partial<ListDto>): Promise<ListDto> {
    this.logger.debug({ input: { createListDto } }, ListTexts.ATTEMPT_CREATE);
    const listEntry = (await this.listModel.create(createListDto)).save();
    const listEntity = (await listEntry).toObject();
    this.logger.debug({ output: listEntity }, ListTexts.CREATED_ONE);
    return listEntity;
  }

  /**
   * Updates a list by its id in the mongodb collection 'lists'.
   *
   * @param id The id of the list.
   * @param modifyListDto The list information to be updated.
   * @returns The updated list object.
   */
  async update(id: string, modifyListDto: Partial<ListDto>): Promise<ListDto> {
    this.logger.debug({ input: { modifyListDto } }, ListTexts.ATTEMPT_UPDATE);
    const list = await this.listModel
      .findOneAndUpdate(
        { _id: id },
        { ...modifyListDto, updated: new Date() },
        { new: true },
      )
      .exec();

    if (!list) {
      throw new NotFoundException(ListTexts.NOT_FOUND);
    }
    this.logger.debug({ output: list }, ListTexts.UPDATED_ONE);
    return list.toObject();
  }

  /**
   * Deletes a list by its id from the mongodb collection 'lists'.
   *
   * @param id The id of the list.
   * @returns The deleted list object.
   */
  async remove(id: string): Promise<ListDto> {
    this.logger.debug({ input: { id } }, ListTexts.ATTEMPT_DELETE);
    const list = await this.listModel.findOneAndDelete({ _id: id }).exec();

    if (!list) {
      throw new NotFoundException(ListTexts.NOT_FOUND);
    }
    this.logger.debug({ output: list }, ListTexts.DELETE_ONE);
    return list.toObject();
  }
}
