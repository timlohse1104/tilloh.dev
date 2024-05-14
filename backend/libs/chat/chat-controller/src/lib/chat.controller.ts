import { ChatService } from '@backend/chat/chat-provider';
import {
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
} from '@backend/shared/types';
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

@ApiTags('chats')
@Controller('/chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOkResponse({
    description: 'List of all chats successfully returned.',
    type: [GetChatsOutputDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Get()
  getChats() {
    return this.chatService.findAll();
  }

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
    return this.chatService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Chat successfully created.',
    type: CreateChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post()
  createChat(@Body() createChatInputDto: CreateChatInputDto) {
    const { name } = createChatInputDto;
    return this.chatService.create(name);
  }

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
    @Body() identifierDto: ChatEntityDto
  ) {
    return this.chatService.update(updateChatInputDto.id, identifierDto);
  }

  @ApiOkResponse({
    description: 'Chat successfully deleted.',
    type: RemoveChatOutputDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request.' })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @Delete('/:id')
  deleteChat(@Param() removeChatInputDto: RemoveChatInputDto) {
    return this.chatService.remove(removeChatInputDto.id);
  }
}
