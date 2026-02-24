import {
  CreateSharedTodoListInputDto,
  CreateSharedTodoListOutputDto,
  GetSharedTodoListInputDto,
  GetSharedTodoListOutputDto,
  GetSharedTodoListsOutputDto,
  RemoveSharedTodoListInputDto,
  RemoveSharedTodoListOutputDto,
  UpdateSharedTodoListInputDto,
  UpdateSharedTodoListOutputDto,
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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TodoService } from '@backend/shared-todo';

@ApiTags('shared-todo-lists')
@Controller('/shared-todo-lists')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of all shared todo lists successfully returned.',
    type: [GetSharedTodoListsOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getSharedTodoLists(@Query() filter?: any) {
    const filterQuery = filter || {};
    return this.todoService.listSharedTodoLists(filterQuery);
  }

  @Public()
  @ApiOkResponse({
    description: 'Shared todo list successfully returned.',
    type: GetSharedTodoListOutputDto,
  })
  @ApiNotFoundResponse({ description: 'Shared todo list not found.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get(':id')
  getSharedTodoList(@Param() getSharedTodoListInput: GetSharedTodoListInputDto) {
    return this.todoService.getSharedTodoList(getSharedTodoListInput);
  }

  @Public()
  @ApiOkResponse({
    description: 'Shared todo list successfully created.',
    type: CreateSharedTodoListOutputDto,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createSharedTodoList(
    @Body() createSharedTodoListInputDto: CreateSharedTodoListInputDto,
  ) {
    return this.todoService.createSharedTodoList(createSharedTodoListInputDto);
  }

  @Public()
  @ApiOkResponse({
    description: 'Shared todo list successfully updated.',
    type: UpdateSharedTodoListOutputDto,
  })
  @ApiNotFoundResponse({ description: 'Shared todo list not found.' })
  @ApiConflictResponse({ description: 'Version conflict.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Put(':id')
  updateSharedTodoList(
    @Param('id') id: string,
    @Body() updateSharedTodoListInputDto: UpdateSharedTodoListInputDto,
  ) {
    return this.todoService.updateSharedTodoList({
      ...updateSharedTodoListInputDto,
      id,
    });
  }

  @Public()
  @ApiOkResponse({
    description: 'Shared todo list successfully removed.',
    type: RemoveSharedTodoListOutputDto,
  })
  @ApiNotFoundResponse({ description: 'Shared todo list not found.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Delete(':id')
  removeSharedTodoList(
    @Param() removeSharedTodoListInputDto: RemoveSharedTodoListInputDto,
  ) {
    return this.todoService.removeSharedTodoList(removeSharedTodoListInputDto);
  }
}