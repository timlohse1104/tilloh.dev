import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedTodoList, SharedTodoListDocument } from './schema/todo.schema';

@Injectable()
export class TodoMongoDbService {
  private readonly logger = new Logger(TodoMongoDbService.name);

  constructor(
    @InjectModel(SharedTodoList.name)
    private sharedTodoListModel: Model<SharedTodoListDocument>,
  ) {}

  async findAll(): Promise<SharedTodoList[]> {
    this.logger.log('Finding all shared todo lists');
    return this.sharedTodoListModel.find().exec();
  }

  async findOne(id: string): Promise<SharedTodoList | null> {
    this.logger.log(`Finding shared todo list with id: ${id}`);
    return this.sharedTodoListModel.findById(id).exec();
  }

  async create(
    name: string,
    emoji: string,
  ): Promise<SharedTodoList> {
    this.logger.log(`Creating new shared todo list: ${name}`);
    const newList = new this.sharedTodoListModel({
      name,
      emoji,
      todos: [],
      history: [],
      version: 1,
    });
    return newList.save();
  }

  async update(
    id: string,
    name: string,
    emoji: string,
    todos: any[],
    history: string[],
    currentVersion: number,
  ): Promise<SharedTodoList> {
    this.logger.log(`Updating shared todo list with id: ${id}`);

    // Atomic update: include version check in the query filter to prevent TOCTOU race condition
    const result = await this.sharedTodoListModel
      .findOneAndUpdate(
        { _id: id, version: currentVersion },
        {
          name,
          emoji,
          todos,
          history,
          version: currentVersion + 1,
          updated: new Date(),
        },
        { new: true },
      )
      .exec();

    // If no result, determine if it's a "not found" or "version conflict"
    if (!result) {
      const list = await this.sharedTodoListModel.findById(id).exec();
      if (!list) {
        this.logger.warn(`Shared todo list not found: ${id}`);
        throw new NotFoundException(`Shared todo list with id ${id} not found`);
      }
      // List exists but version didn't match - conflict
      this.logger.warn(
        `Version conflict for list ${id}. Expected: ${currentVersion}, Current: ${list.version}`,
      );
      throw new ConflictException(
        `Version conflict. Expected version ${currentVersion}, but current version is ${list.version}`,
      );
    }

    return result;
  }

  async remove(id: string): Promise<SharedTodoList | null> {
    this.logger.log(`Removing shared todo list with id: ${id}`);
    return this.sharedTodoListModel.findByIdAndDelete(id).exec();
  }
}