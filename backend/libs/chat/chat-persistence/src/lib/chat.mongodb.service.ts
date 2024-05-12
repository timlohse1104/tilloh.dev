import { ChatTexts } from '@backend/shared/texts';
import { ChatEntityDto } from '@backend/shared/types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';

@Injectable()
export class ChatMongoDbService {
  private readonly logger = new Logger(ChatMongoDbService.name);

  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>
  ) {}

  async findAll(): Promise<ChatEntityDto[]> {
    this.logger.debug({ input: {} }, ChatTexts.DB_ATTEMPT_FIND_ALL);
    const chats = await this.chatModel.find();
    this.logger.debug(
      { output: { chats } },
      `Found ${chats.length} chats in mongodb.`
    );
    return chats;
  }

  async findOne(id: string): Promise<ChatEntityDto> {
    this.logger.debug({ input: { id } }, ChatTexts.DB_ATTEMPT_FIND_ONE);
    const chat = await this.chatModel.findOne({ _id: id }).exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: { chat } }, ChatTexts.DB_FOUND_ONE);
    return chat;
  }

  async create(name: string): Promise<ChatEntityDto> {
    this.logger.debug({ input: {} }, ChatTexts.DB_ATTEMPT_CREATE);
    const chat = (
      await this.chatModel.create({
        _id: randomUUID(),
        name,
      })
    ).save();
    this.logger.debug({ output: { chat: chat } }, ChatTexts.DB_CREATED_ONE);
    return chat;
  }

  async update(
    id: string,
    chatDto: Partial<ChatEntityDto>
  ): Promise<ChatEntityDto> {
    this.logger.debug({ input: { id, chatDto } }, ChatTexts.DB_ATTEMPT_UPDATE);
    const chat = await this.chatModel
      .findOneAndUpdate(
        { _id: id },
        { ...chatDto, updated: new Date() },
        { new: true }
      )
      .exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: { chat } }, ChatTexts.DB_UPDATED_ONE);
    return chat;
  }

  async remove(id: string) {
    this.logger.debug({ input: { id } }, ChatTexts.DB_ATTEMPT_DELETE);
    const chat = await this.chatModel.findOneAndDelete({ _id: id }).exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: { chat } }, ChatTexts.DB_DELETE_ONE);
    return chat;
  }
}
