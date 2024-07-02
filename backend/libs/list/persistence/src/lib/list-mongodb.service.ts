import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { List } from '../interfaces/list.interface';

@Injectable()
export class ListMongoDBService {
  constructor(@InjectModel('List') private readonly listModel: Model<List>) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const createdList = new this.listModel(createListDto);
    return createdList.save();
  }

  async findAll(): Promise<List[]> {
    return this.listModel.find().exec();
  }

  async findOne(id: string): Promise<List> {
    return this.listModel.findById(id).exec();
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<List> {
    return this.listModel
      .findByIdAndUpdate(id, updateListDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<List> {
    return this.listModel.findByIdAndRemove(id).exec();
  }
}
