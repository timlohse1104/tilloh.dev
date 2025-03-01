import { ListDto } from '@backend/shared-types';
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
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListsService } from './lists.service';

@ApiTags('lists')
@Controller('/lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Lists.',
    type: [ListDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/')
  getLists(@Query() filter?: ListDto) {
    const filterQuery = filter || {};
    return this.listsService.getLists(filterQuery);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List by id.',
    type: ListDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get('/:id')
  getList(@Param('id') id: string) {
    return this.listsService.getList(id);
  }

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List created.',
    type: ListDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post('/')
  createList(@Body() listDto: ListDto) {
    return this.listsService.createList(listDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List updated.',
    type: ListDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Put('/:id')
  updateList(@Param('id') id: string, @Body() listDto: ListDto) {
    return this.listsService.updateList(id, listDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List deleted.',
    type: ListDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Delete('/:id')
  deleteList(@Param('id') id: string) {
    return this.listsService.deleteList(id);
  }
}
