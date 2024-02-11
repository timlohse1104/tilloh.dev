import { IdentifiersMongoDbService } from '@backend/memorandum/memorandum-persistence';
import {
  CreateIdentifierInputDto,
  CreateIdentifierOutputDto,
  GetIdentifierInputDto,
  GetIdentifierOutputDto,
  GetIdentifiersOutputDto,
  IdentifierDto,
  RemoveIdentifierOutputDto,
  UpdateIdentifierOutputDto,
} from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IdentifiersService {
  private readonly logger = new Logger(IdentifiersService.name);
  constructor(private identifiersMongoDbService: IdentifiersMongoDbService) {}

  async getIdentifiers(): Promise<GetIdentifiersOutputDto[]> {
    this.logger.log('returned list of all identifiers');
    return await this.identifiersMongoDbService.findAll();
  }

  async getIdentifier(
    getIdentifierInput: GetIdentifierInputDto
  ): Promise<GetIdentifierOutputDto> {
    this.logger.log('returns one identifier');
    return await this.identifiersMongoDbService.findOne(getIdentifierInput.id);
  }

  async createIdentifier(
    createIdentifierInputDto: CreateIdentifierInputDto
  ): Promise<CreateIdentifierOutputDto> {
    this.logger.log('creates an identifier');
    return this.identifiersMongoDbService.create(createIdentifierInputDto.name);
  }

  async updateIdentifier(
    id: string,
    identifierDto: IdentifierDto
  ): Promise<UpdateIdentifierOutputDto> {
    this.logger.log('updates identifier with id:' + id);
    return await this.identifiersMongoDbService.update(id, identifierDto);
  }

  async deleteIdentifier(id: string): Promise<RemoveIdentifierOutputDto> {
    this.logger.log('deleted identifier with id:' + id);
    return this.identifiersMongoDbService.remove(id);
  }
}
