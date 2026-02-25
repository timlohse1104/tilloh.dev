import { IdentifiersTexts } from '@backend/shared-texts';
import { IdentifierDto } from '@backend/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Filter } from 'mongodb';
import { Model } from 'mongoose';
import { Identifier, IdentifierDocument } from './schema/identifiers.schema';

@Injectable()
export class IdentifiersMongoDbService {
  private readonly logger = new Logger(IdentifiersMongoDbService.name);

  constructor(
    @InjectModel(Identifier.name)
    private identifierModel: Model<IdentifierDocument>,
  ) {}

  /**
   * Fetches all identifiers from the mongodb collection 'identifiers'.
   *
   * @param filter Optional param to filter for specific identifier results.
   * @returns An array of identifier objects.
   */
  async findAll(
    filter: Filter<IdentifierDocument> = {},
  ): Promise<IdentifierDto[]> {
    this.logger.debug({ input: { filter } }, IdentifiersTexts.ATTEMPT_FIND_ALL);
    const identifiers = await this.identifierModel.find(filter as any).exec();
    const identifierEntities = identifiers.map(
      (identifier) => identifier.toObject() as IdentifierDto,
    );
    this.logger.debug(
      { output: identifiers },
      `MongoDb responded, found ${identifiers.length} identifiers.`,
    );
    return identifierEntities;
  }

  /**
   * Fetches an identifier by its id from the mongodb collection 'identifiers'.
   *
   * @param id The id of the identifier.
   * @returns A single identifier object.
   */
  async findOne(id: string): Promise<IdentifierDto> {
    this.logger.debug({ input: { id } }, IdentifiersTexts.ATTEMPT_FIND_ONE);
    const identifier = await this.identifierModel.findOne({ _id: id }).exec();

    if (!identifier) {
      throw new NotFoundException(IdentifiersTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, IdentifiersTexts.FOUND_ONE);
    return identifier.toObject();
  }

  /**
   * Creates an identifier in the mongodb collection 'identifiers'.
   *
   * @param name The name of the identifier.
   * @returns The created identifier.
   */
  async create(name: string): Promise<IdentifierDto> {
    this.logger.debug({ input: {} }, IdentifiersTexts.ATTEMPT_CREATE);
    const identifier = (
      await this.identifierModel.create({
        _id: randomUUID(),
        name,
      })
    ).save();
    const identifierEntity = (await identifier).toObject() as IdentifierDto;
    this.logger.debug(
      { output: identifierEntity },
      IdentifiersTexts.CREATED_ONE,
    );
    return identifierEntity;
  }

  /**
   * Updates an identifier.
   *
   * @param id The id of the identifier.
   * @param identifierDto The identifier information to be updated.
   * @returns The updated identifier.
   */
  async update(
    id: string,
    identifierDto: Partial<IdentifierDto>,
  ): Promise<IdentifierDto> {
    this.logger.debug(
      { input: { id, identifierDto } },
      IdentifiersTexts.ATTEMPT_UPDATE,
    );
    const identifier = await this.identifierModel
      .findOneAndUpdate(
        { _id: id },
        { ...identifierDto, updated: new Date() },
        { new: true },
      )
      .exec();

    if (!identifier) {
      throw new NotFoundException(IdentifiersTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, IdentifiersTexts.UPDATED_ONE);
    return identifier.toObject();
  }

  /**
   * Deletes an identifier.
   *
   * @param id The id of the identifier.
   * @returns The deleted identifier.
   */
  async remove(id: string) {
    this.logger.debug({ input: { id } }, IdentifiersTexts.ATTEMPT_DELETE);
    const identifier = await this.identifierModel
      .findOneAndDelete({ _id: id })
      .exec();

    if (!identifier) {
      throw new NotFoundException(IdentifiersTexts.NOT_FOUND);
    }
    this.logger.debug({ output: identifier }, IdentifiersTexts.DELETE_ONE);
    return identifier.toObject();
  }
}
