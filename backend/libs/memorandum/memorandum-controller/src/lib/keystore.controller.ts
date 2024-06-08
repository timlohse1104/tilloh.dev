import { KeystoreMongoDbService } from '@backend/shared-keystore-persistence';
import { KeystoreTexts } from '@backend/shared-texts';
import {
  CreateKeystoreInputDto,
  CreateKeystoreOutputDto,
  GetKeystoreInputDto,
  GetKeystoreOutputDto,
  RemoveKeystoreInputDto,
  RemoveKeystoreOutputDto,
  UpdateKeystoreInputBodyDto,
  UpdateKeystoreInputParamDto,
  UpdateKeystoreOutputDto,
} from '@backend/shared-types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('keystore')
@Controller('/keystore')
export class KeystoreController {
  constructor(private keystoreService: KeystoreMongoDbService) {}

  @ApiOkResponse({
    description: 'List of all keys successfully returned.',
    type: [GetKeystoreOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getKeys() {
    return this.keystoreService.findAll();
  }

  @ApiOkResponse({
    description: 'Key successfully returned.',
    type: GetKeystoreOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: KeystoreTexts.NOT_FOUND })
  @Get('/:identifier/:key')
  getKey(@Param() getKeystoreInput: GetKeystoreInputDto) {
    return this.keystoreService.findOne(
      getKeystoreInput.identifier,
      getKeystoreInput.key
    );
  }

  @ApiOkResponse({
    description: 'Key successfully created.',
    type: CreateKeystoreOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createKey(@Body() createKeystoreInputDto: CreateKeystoreInputDto) {
    return this.keystoreService.create(
      createKeystoreInputDto.identifier,
      createKeystoreInputDto.key,
      createKeystoreInputDto.value
    );
  }

  @ApiOkResponse({
    description: 'Key successfully updated.',
    type: UpdateKeystoreOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: KeystoreTexts.NOT_FOUND })
  @Put('/:identifier/:key')
  updateIdentifier(
    @Param() updateIdentifierInputDto: UpdateKeystoreInputParamDto,
    @Body() keystoreDto: UpdateKeystoreInputBodyDto
  ) {
    return this.keystoreService.update(
      updateIdentifierInputDto.identifier,
      updateIdentifierInputDto.key,
      keystoreDto
    );
  }

  @ApiOkResponse({
    description: 'Identifiers successfully deleted.',
    type: RemoveKeystoreOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: KeystoreTexts.NOT_FOUND })
  @Delete('/:identifier/:key')
  deleteIdentifier(@Param() removeKeystoreInputDto: RemoveKeystoreInputDto) {
    return this.keystoreService.remove(
      removeKeystoreInputDto.identifier,
      removeKeystoreInputDto.key
    );
  }
}
