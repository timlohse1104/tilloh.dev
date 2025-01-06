import {
  IdentifierDocument,
  IdentifiersMongoDbService,
} from '@backend/memorandum/memorandum-persistence';
import {
  CreateIdentifierInputDto,
  CreateIdentifierOutputDto,
  GetIdentifierInputDto,
  GetIdentifierOutputDto,
  GetIdentifiersOutputDto,
  IdentifierDto,
  RemoveIdentifierOutputDto,
  UpdateIdentifierOutputDto,
} from '@backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

@Injectable()
export class IdentifiersService {
  private readonly logger = new Logger(IdentifiersService.name);
  constructor(private identifiersMongoDbService: IdentifiersMongoDbService) {}

  /**
   * Fetches all identifiers.
   *
   * @param filter Optional param to filter for specific identifier results.
   * @returns An array of identifier objects.
   */
  async listIdentifiers(
    filter: FilterQuery<IdentifierDocument> = {},
  ): Promise<GetIdentifiersOutputDto[]> {
    this.logger.log('Return a list of all identifiers.');
    return await this.identifiersMongoDbService.findAll(filter);
  }

  /**
   * Fetches an identifier by its id.
   *
   * @param getIdentifierInput The id of the identifier.
   * @returns A single identifier object.
   */
  async getIdentifier(
    getIdentifierInput: GetIdentifierInputDto,
  ): Promise<GetIdentifierOutputDto> {
    this.logger.log('Returns a single identifier.');
    return await this.identifiersMongoDbService.findOne(getIdentifierInput.id);
  }

  /**
   * Creates an identifier.
   *
   * @param createIdentifierInputDto The name of the identifier.
   * @returns The created identifier.
   */
  async createIdentifier(
    createIdentifierInputDto: CreateIdentifierInputDto,
  ): Promise<CreateIdentifierOutputDto> {
    this.logger.log('Create a new identifier.');
    return this.identifiersMongoDbService.create(createIdentifierInputDto.name);
  }

  /**
   * Updates an identifier.
   *
   * @param id The id of the identifier.
   * @param identifierDto The identifier information to be updated.
   * @returns
   */
  async updateIdentifier(
    id: string,
    identifierDto: IdentifierDto,
  ): Promise<UpdateIdentifierOutputDto> {
    this.logger.log(`Update an identifier with id ${id}.`);
    return await this.identifiersMongoDbService.update(id, identifierDto);
  }

  /**
   * Deletes an identifier.
   *
   * @param id The id of the identifier.
   * @returns The deleted identifier.
   */
  async deleteIdentifier(id: string): Promise<RemoveIdentifierOutputDto> {
    this.logger.log(`Deleted identifier with id ${id}.`);
    return this.identifiersMongoDbService.remove(id);
  }
}
