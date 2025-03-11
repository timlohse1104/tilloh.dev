import { KeystoreMongoDbService } from '@backend/shared-keystore-persistence';
import { KeystoreTexts } from '@backend/shared-texts';
import {
  CreateKeystoreInputDto,
  CreateKeystoreOutputDto,
  GetKeystoreInputDto,
  GetKeystoreOutputDto,
  KeystoreDto,
  RemoveKeystoreInputDto,
  RemoveKeystoreOutputDto,
  UpdateKeystoreInputBodyDto,
  UpdateKeystoreInputParamDto,
  UpdateKeystoreOutputDto,
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
} from 'npm:@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from 'npm:@nestjs/swagger';

@ApiTags('keystore')
@Controller('/keystore')
export class KeystoreController {
  constructor(private keystoreService: KeystoreMongoDbService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of all keys successfully returned.',
    type: [GetKeystoreOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getKeys(@Query() filter?: KeystoreDto) {
    const filterQuery = filter || {};
    return this.keystoreService.findAll(filterQuery);
  }

  @Public()
  @ApiOkResponse({
    description: 'Key successfully returned.',
    type: GetKeystoreOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: KeystoreTexts.NOT_FOUND })
  @Get('/:identifier/:key')
  getKey(@Param() getKeystoreInput: GetKeystoreInputDto) {
    return this.keystoreService.findOne(
      getKeystoreInput.identifier,
      getKeystoreInput.key,
    );
  }

  @Public()
  @ApiOkResponse({
    description: 'Key successfully created.',
    type: CreateKeystoreOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createKey(@Body() createKeystoreInputDto: CreateKeystoreInputDto) {
    return this.keystoreService.create(
      createKeystoreInputDto.identifier,
      createKeystoreInputDto.key,
      createKeystoreInputDto.value,
    );
  }

  @Public()
  @ApiOkResponse({
    description: 'Key successfully updated.',
    type: UpdateKeystoreOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: KeystoreTexts.NOT_FOUND })
  @Put('/:identifier/:key')
  updateKey(
    @Param() updateIdentifierInputDto: UpdateKeystoreInputParamDto,
    @Body() keystoreDto: UpdateKeystoreInputBodyDto,
  ) {
    return this.keystoreService.update(
      updateIdentifierInputDto.identifier,
      updateIdentifierInputDto.key,
      keystoreDto,
    );
  }

  @ApiBearerAuth()
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
      removeKeystoreInputDto.key,
    );
  }
}
