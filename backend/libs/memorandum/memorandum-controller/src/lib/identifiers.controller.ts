import { IdentifiersService } from '@backend/memorandum/memorandum-provider';
import {
  CreateIdentifierInputDto,
  CreateIdentifierOutputDto,
  GetIdentifierInputDto,
  GetIdentifierOutputDto,
  GetIdentifiersOutputDto,
  IdentifierDto,
  RemoveIdentifierInputDto,
  RemoveIdentifierOutputDto,
  UpdateIdentifierInputDto,
  UpdateIdentifierOutputDto,
} from '@backend/shared-types';
import { Public } from '@backend/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';

@ApiTags('identifiers')
@Controller('/identifiers')
export class IdentifiersController {
  constructor(private identifiersService: IdentifiersService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of all identifiers successfully returned.',
    type: [GetIdentifiersOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getIdentifiers(@Query() filter?: IdentifierDto) {
    const filterQuery: FilterQuery<IdentifierDto> = filter || {};
    return this.identifiersService.listIdentifiers(filterQuery);
  }

  @Public()
  @ApiOkResponse({
    description: 'Identifier successfully returned.',
    type: GetIdentifierOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Get('/:id')
  getIdentifier(@Param() getIdentifierInput: GetIdentifierInputDto) {
    return this.identifiersService.getIdentifier(getIdentifierInput);
  }

  @Public()
  @ApiOkResponse({
    description: 'Identifier successfully created.',
    type: CreateIdentifierOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createIdentifier(@Body() createIdentifierInputDto: CreateIdentifierInputDto) {
    return this.identifiersService.createIdentifier(createIdentifierInputDto);
  }

  @Public()
  @ApiOkResponse({
    description: 'Identifier successfully updated.',
    type: UpdateIdentifierOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Put('/:id')
  updateIdentifier(
    @Param() updateIdentifierInputDto: UpdateIdentifierInputDto,
    @Body() identifierDto: IdentifierDto,
  ) {
    return this.identifiersService.updateIdentifier(
      updateIdentifierInputDto.id,
      identifierDto,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Identifiers successfully deleted.',
    type: RemoveIdentifierOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Delete('/:id')
  deleteIdentifier(
    @Param() removeIdentifierInputDto: RemoveIdentifierInputDto,
  ) {
    return this.identifiersService.deleteIdentifier(
      removeIdentifierInputDto.id,
    );
  }
}
