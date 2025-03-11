import { KeystoreTexts } from '@backend/shared-texts';
import { KeystoreDto, UpdateKeystoreInputBodyDto } from '@backend/shared-types';
import { randomUUID } from 'node:crypto';
import { Injectable, Logger, NotFoundException } from 'npm:@nestjs/common';
import { InjectModel } from 'npm:@nestjs/mongoose';
import { FilterQuery, Model } from 'npm:mongoose';
import { Keystore, KeystoreDocument } from './schema/keystore.schema';

@Injectable()
export class KeystoreMongoDbService {
  private readonly logger = new Logger(KeystoreMongoDbService.name);

  constructor(
    @InjectModel(Keystore.name)
    private keystoreModel: Model<KeystoreDocument>,
  ) {}

  /**
   * Fetches all keys.
   *
   * @param filter Optional param to filter for specific key results.
   * @returns An array of key objects.
   */
  async findAll(
    filter: FilterQuery<KeystoreDocument> = {},
  ): Promise<KeystoreDto[]> {
    this.logger.debug({ input: { filter } }, KeystoreTexts.ATTEMPT_FIND_ALL);
    const keys = await this.keystoreModel.find(filter);
    this.logger.debug(
      { output: keys },
      `MongoDb responded, found ${keys.length} keys.`,
    );
    return keys;
  }

  /**
   * Fetches a key by its identifier and key.
   *
   * @param identifier The identifier of the key.
   * @param key The key to be fetched.
   * @returns A single key object.
   */
  async findOne(identifier: string, key: string): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key } },
      KeystoreTexts.ATTEMPT_FIND_ONE,
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

  /**
   * Creates a key.
   *
   * @param identifier The identifier of the key.
   * @param key The key to be created.
   * @param value The value of the key.
   * @returns The created key.
   */
  async create(
    identifier: string,
    key: string,
    value: string,
  ): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key, value } },
      KeystoreTexts.ATTEMPT_CREATE,
    );
    const keyEntry = (
      await this.keystoreModel.create({
        _id: randomUUID(),
        identifier,
        key,
        value,
      })
    ).save();
    const keyEntryEntity = (await keyEntry).toObject();
    this.logger.debug({ output: keyEntryEntity }, KeystoreTexts.CREATED_ONE);
    return keyEntryEntity;
  }

  /**
   * Updates a key.
   *
   * @param identifier The identifier of the key.
   * @param key The key to be updated.
   * @param updateKeystoreInputBodyDto The key information to be updated.
   * @returns The updated key.
   */
  async update(
    identifier: string,
    key: string,
    updateKeystoreInputBodyDto: Partial<UpdateKeystoreInputBodyDto>,
  ): Promise<KeystoreDto> {
    this.logger.debug(
      { input: { identifier, key, updateKeystoreInputBodyDto } },
      KeystoreTexts.ATTEMPT_UPDATE,
    );
    const keyEntry = await this.keystoreModel
      .findOneAndUpdate(
        { identifier, key },
        { ...updateKeystoreInputBodyDto, updated: new Date() },
        { new: true },
      )
      .exec();

    if (!keyEntry) {
      throw new NotFoundException(KeystoreTexts.NOT_FOUND);
    }
    this.logger.debug({ output: keyEntry }, KeystoreTexts.UPDATED_ONE);
    return keyEntry.toObject();
  }

  /**
   * Deletes a key.
   *
   * @param identifier The identifier of the key.
   * @param key The key to be deleted.
   * @returns The deleted key.
   */
  async remove(identifier: string, key: string) {
    this.logger.debug(
      { input: { identifier, key } },
      KeystoreTexts.ATTEMPT_DELETE,
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
