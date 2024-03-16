import { IdentifierDto } from '@backend/shared/types';
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
    private identifierModel: Model<ChatDocument>
  ) {}

  async findAll(): Promise<IdentifierDto[]> {
    this.logger.debug({ input: {} }, ChatTexts.ATTEMPT_FIND_ALL);
    const chat = await this.identifierModel.find();
    this.logger.debug(
      { output: chat },
      `MongoDb responded, found ${chat.length} chat.`
    );
    return chat;
  }

  async findOne(id: string): Promise<IdentifierDto> {
    this.logger.debug({ input: { id } }, ChatTexts.ATTEMPT_FIND_ONE);
    const identifier = await this.identifierModel.findOne({ _id: id }).exec();

    if (!identifier) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, ChatTexts.FOUND_ONE);
    return identifier;
  }

  async create(name: string): Promise<IdentifierDto> {
    this.logger.debug({ input: {} }, ChatTexts.ATTEMPT_CREATE);
    const identifier = await this.identifierModel.create({
      _id: randomUUID(),
      name,
    });
    this.logger.debug(
      { output: identifier?.toObject() },
      ChatTexts.CREATED_ONE
    );
    return identifier;
  }

  async update(
    id: string,
    identifierDto: Partial<IdentifierDto>
  ): Promise<IdentifierDto> {
    this.logger.debug(
      { input: { id, identifierDto } },
      ChatTexts.ATTEMPT_UPDATE
    );
    const identifier = await this.identifierModel
      .findOneAndUpdate(
        { _id: id },
        { ...identifierDto, updated: new Date() },
        { new: true }
      )
      .exec();

    if (!identifier) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, ChatTexts.UPDATED_ONE);
    return identifier;
  }

  async remove(id: string) {
    this.logger.debug({ input: { id } }, ChatTexts.ATTEMPT_DELETE);
    const identifier = await this.identifierModel
      .findOneAndDelete({ _id: id })
      .exec();

    if (!identifier) {
      throw new NotFoundException(ChatTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, ChatTexts.DELETE_ONE);
    return identifier;
  }
}
