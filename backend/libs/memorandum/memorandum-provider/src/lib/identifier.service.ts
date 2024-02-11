import {
  CreateIdentifierOutputDto,
  GetIdentifierInputDto,
  GetIdentifierOutputDto,
  GetIdentifiersOutputDto,
  IdentifierDto,
  RemoveIdentifierOutputDto,
  UpdateIdentifierOutputDto,
} from '@backend/shared/types';
import { Logger } from '@nestjs/common';

export class IdentifiersService {
  private readonly logger = new Logger(IdentifiersService.name);
  constructor() {}

  async getIdentifiers(): Promise<GetIdentifiersOutputDto[]> {
    this.logger.log('returned list of all identifiers');
    return await [
      { id: '1', name: 'identifier1' },
      { id: '2', name: 'identifier2' },
    ];
  }

  async getIdentifier(
    getIdentifierInput: GetIdentifierInputDto
  ): Promise<GetIdentifierOutputDto> {
    this.logger.log('returns one identifier');
    return await {
      id: getIdentifierInput.id,
      name: 'identifier' + getIdentifierInput.id,
    };
  }

  async createIdentifier(): Promise<CreateIdentifierOutputDto> {
    this.logger.log('creates an identifier');
    return { id: '1', name: 'identifier1' };
  }

  async updateIdentifier(
    id: string,
    identifierDto: IdentifierDto
  ): Promise<UpdateIdentifierOutputDto> {
    this.logger.log('updates identifier with id:' + id);
    return await identifierDto;
  }

  async deleteIdentifier(id: string): Promise<RemoveIdentifierOutputDto> {
    this.logger.log('deleted identifier with id:' + id);
    return { id: id, name: 'identifier' + id };
  }
}
