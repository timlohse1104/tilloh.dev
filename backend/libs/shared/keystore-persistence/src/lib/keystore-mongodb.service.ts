import { KeystoreTexts } from '@backend/shared/texts';
import { KeystoreDto } from '@backend/shared/types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Keystore, KeystoreDocument } from './schema/keystore.schema';

@Injectable()
export class KeystoreMongoDbService {
  private readonly logger = new Logger(KeystoreMongoDbService.name);

  constructor(
    @InjectModel(Keystore.name)
    private keystoreModel: Model<KeystoreDocument>
  ) {}

  async findAll(): Promise<KeystoreDto[]> {
    this.logger.debug({ input: {} }, KeystoreTexts.ATTEMPT_FIND_ALL);
    const keys = await this.keystoreModel.find();
    this.logger.debug(
      { output: keys },
      `MongoDb responded, found ${keys.length} identifiers.`
    );
    return keys;
  }

  async findOne(id: string): Promise<KeystoreDto> {
    this.logger.debug({ input: { id } }, KeystoreTexts.ATTEMPT_FIND_ONE);
    const identifier = await this.keystoreModel.findOne({ _id: id }).exec();

    if (!identifier) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, KeystoreTexts.FOUND_ONE);
    return identifier;
  }

  async create(name: string): Promise<KeystoreDto> {
    this.logger.debug({ input: {} }, KeystoreTexts.ATTEMPT_CREATE);
    const identifier = await this.keystoreModel.create({
      _id: randomUUID(),
      name,
    });
    this.logger.debug(
      { output: identifier?.toObject() },
      KeystoreTexts.CREATED_ONE
    );
    return identifier;
  }

  async update(
    id: string,
    identifierDto: Partial<KeystoreDto>
  ): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { id, identifierDto } },
      KeystoreTexts.ATTEMPT_UPDATE
    );
    const identifier = await this.keystoreModel
      .findOneAndUpdate(
        { _id: id },
        { ...identifierDto, updated: new Date() },
        { new: true }
      )
      .exec();

    if (!identifier) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, KeystoreTexts.UPDATED_ONE);
    return identifier;
  }

  async remove(id: string) {
    this.logger.debug({ input: { id } }, KeystoreTexts.ATTEMPT_DELETE);
    const identifier = await this.keystoreModel
      .findOneAndDelete({ _id: id })
      .exec();

    if (!identifier) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, KeystoreTexts.DELETE_ONE);
    return identifier;
  }
}
