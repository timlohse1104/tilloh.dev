import { ChatTexts } from '@backend/shared-texts';
import { ChatEntityDto } from '@backend/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { FilterQuery, Model } from 'mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';

@Injectable()
export class ChatMongoDbService {
  private readonly logger = new Logger(ChatMongoDbService.name);

  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>,
  ) {}

  /**
   * Fetches all chats from the mongodb collection 'chats'.
   *
   * @param filter Optional param to filter for specific chat results.
   * @returns An array of chat objects.
   */
  async findAll(
    filter: FilterQuery<ChatDocument> = {},
  ): Promise<ChatEntityDto[]> {
    this.logger.debug({ input: { filter } }, ChatTexts.DB_ATTEMPT_FIND_ALL);
    const chats = await this.chatModel.find(filter).exec();
    const chatEntities = chats.map((chat) => chat.toObject() as ChatEntityDto);
    this.logger.debug(
      { output: { chats } },
      `Found ${chats.length} chats in mongodb.`,
    );
    return chatEntities;
  }

  /**
   * Fetches a chat by its id from the mongodb collection 'chats'.
   *
   * @param id The id of the chat.
   * @returns A single chat object.
   */
  async findOne(id: string): Promise<ChatEntityDto> {
    this.logger.debug({ input: { id } }, ChatTexts.DB_ATTEMPT_FIND_ONE);
    const chat = await this.chatModel.findOne({ _id: id }).exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    const chatEntity = chat.toObject() as ChatEntityDto;
    this.logger.debug({ output: { chat: chatEntity } }, ChatTexts.DB_FOUND_ONE);
    return chatEntity;
  }

  /**
   * Creates a chat in the mongodb collection 'chats'.
   *
   * @param name The name of the chat.
   * @returns The created chat object.
   */
  async create(name: string): Promise<ChatEntityDto> {
    this.logger.debug({ input: {} }, ChatTexts.DB_ATTEMPT_CREATE);
    const chat = (
      await this.chatModel.create({
        _id: randomUUID(),
        name,
      })
    ).save();
    const chatEntity = (await chat).toObject() as ChatEntityDto;
    this.logger.debug(
      { output: { chat: chatEntity } },
      ChatTexts.DB_CREATED_ONE,
    );
    return chatEntity;
  }

  /**
   * Updates a chat by its id in the mongodb collection 'chats'.
   *
   * @param id The id of the chat.
   * @param chatDto The chat information to be updated.
   * @returns The updated chat object.
   */
  async update(
    id: string,
    chatDto: Partial<ChatEntityDto>,
  ): Promise<ChatEntityDto> {
    this.logger.debug({ input: { id, chatDto } }, ChatTexts.DB_ATTEMPT_UPDATE);
    const chat = await this.chatModel
      .findOneAndUpdate(
        { _id: id },
        { ...chatDto, updated: new Date() },
        { new: true },
      )
      .exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    const chatEntity = chat.toObject() as ChatEntityDto;
    this.logger.debug(
      { output: { chat: chatEntity } },
      ChatTexts.DB_UPDATED_ONE,
    );
    return chatEntity;
  }

  /**
   * Removes a chat by its id from the mongodb collection 'chats'.
   *
   * @param id The id of the chat.
   * @returns The deleted chat object.
   */
  async remove(id: string): Promise<ChatEntityDto> {
    this.logger.debug({ input: { id } }, ChatTexts.DB_ATTEMPT_DELETE);
    const chat = await this.chatModel.findOneAndDelete({ _id: id }).exec();

    if (!chat) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    const chatEntity = chat.toObject() as ChatEntityDto;
    this.logger.debug({ output: { chatEntity } }, ChatTexts.DB_DELETE_ONE);
    return chatEntity;
  }
}
