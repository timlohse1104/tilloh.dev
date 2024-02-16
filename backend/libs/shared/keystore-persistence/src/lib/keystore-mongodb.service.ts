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

  async findOne(identifier: string, key: string): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key } },
      KeystoreTexts.ATTEMPT_FIND_ONE
    );
    const keyEntry = await this.keystoreModel
      .findOne({ identifier, key })
      .exec();

    if (!keyEntry) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: keyEntry }, KeystoreTexts.FOUND_ONE);
    return keyEntry;
  }

  async create(
    identifier: string,
    key: string,
    value: string
  ): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key, value } },
      KeystoreTexts.ATTEMPT_CREATE
    );
    const keyEntry = await this.keystoreModel.create({
      _id: randomUUID(),
      identifier,
      key,
      value,
    });
    this.logger.debug(
      { output: keyEntry?.toObject() },
      KeystoreTexts.CREATED_ONE
    );
    return keyEntry;
  }

  async update(
    identifier: string,
    key: string,
    keystoreDto: Partial<KeystoreDto>
  ): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key, keystoreDto } },
      KeystoreTexts.ATTEMPT_UPDATE
    );
    const keyEntry = await this.keystoreModel
      .findOneAndUpdate(
        { identifier, key },
        { ...keystoreDto, updated: new Date() },
        { new: true }
      )
      .exec();

    if (!keyEntry) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: keyEntry }, KeystoreTexts.UPDATED_ONE);
    return keyEntry;
  }

  async remove(identifier: string, key: string) {
    this.logger.debug(
      { input: { identifier, key } },
      KeystoreTexts.ATTEMPT_DELETE
    );
    const keyEntry = await this.keystoreModel
      .findOneAndDelete({ identifier, key })
      .exec();

    if (!keyEntry) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: keyEntry }, KeystoreTexts.DELETE_ONE);
    return keyEntry;
  }
}
