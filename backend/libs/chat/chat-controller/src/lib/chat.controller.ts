import { ChatDocument } from '@backend/chat/chat-persistence';
import { ChatService } from '@backend/chat/chat-provider';
import {
  ChatDto,
  ChatEntityDto,
  CreateChatInputDto,
  CreateChatOutputDto,
  GetChatInputDto,
  GetChatOutputDto,
  GetChatsOutputDto,
  RemoveChatInputDto,
  RemoveChatOutputDto,
  UpdateChatInputDto,
  UpdateChatOutputDto,
} from '@backend/shared-types';
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';

@ApiTags('chats')
@Controller('/chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of all chats successfully returned.',
    type: [GetChatsOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiQuery({ name: 'filter', required: false, type: ChatDto })
  @Get()
  getChats(@Query() filter: FilterQuery<ChatDocument> = {}) {
    return this.chatService.listChats(filter);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Chat successfully returned.',
    type: GetChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @Get('/:id')
  getChat(@Param() getChatInput: GetChatInputDto) {
    const { id } = getChatInput;
    return this.chatService.findChat(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Chat successfully created.',
    type: CreateChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createChat(@Body() createChatInputDto: CreateChatInputDto) {
    const { name } = createChatInputDto;
    return this.chatService.createChat(name);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Chat successfully updated.',
    type: UpdateChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @Put('/:id')
  updateChat(
    @Param() updateChatInputDto: UpdateChatInputDto,
    @Body() identifierDto: ChatEntityDto,
  ) {
    return this.chatService.updateChat(updateChatInputDto.id, identifierDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Chat successfully deleted.',
    type: RemoveChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @Delete('/:id')
  deleteChat(@Param() removeChatInputDto: RemoveChatInputDto) {
    return this.chatService.removeChat(removeChatInputDto.id);
  }
}
