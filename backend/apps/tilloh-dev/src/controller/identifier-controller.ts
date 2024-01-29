import { Controller, Delete, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('identifier')
@Controller('/identifier')
export class AppController {
  constructor() {}

  @ApiOkResponse({
    description: 'All identifiers successfully returned.',
    type: Array,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getIdentifiers() {
    return { message: 'returns all identifiers' };
  }

  @ApiOkResponse({
    description: 'Identifier successfully returned.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Get('/{id}')
  getIdentifier() {
    return { message: 'returns one identifier' };
  }

  @ApiOkResponse({
    description: 'Identifier successfully created.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createIdentifier() {
    return { message: 'creates an identifier' };
  }

  @ApiOkResponse({
    description: 'Identifier successfully updated.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Post('/{id}')
  updateIdentifier() {
    return { message: 'updates an identifier' };
  }

  @ApiOkResponse({
    description: 'Identifiers successfully deleted.',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Identifier not found.' })
  @Delete('/{id}')
  deleteIdentifier() {
    return { message: 'deletes an identifier' };
  }
}
