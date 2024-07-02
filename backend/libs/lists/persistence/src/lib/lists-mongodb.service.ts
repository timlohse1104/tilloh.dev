import { CreateListDto, UpdateListDto } from '@backend/types/lists.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List } from './schema/lists.schema';

@Injectable()
export class ListsMongoDBService {
  constructor(@InjectModel('List') private readonly listsModel: Model<List>) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const createdList = new this.listsModel(createListDto);
    return createdList.save();
  }

  async findAll(): Promise<List[]> {
    return this.listsModel.find().exec();
  }

  async findOne(id: string): Promise<List> {
    return this.listsModel.findById(id).exec();
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<List> {
    return this.listsModel
      .findByIdAndUpdate(id, updateListDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<List> {
    return this.listsModel.findByIdAndRemove(id).exec();
  }
}
