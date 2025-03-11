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
} from 'npm:@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from 'npm:@nestjs/swagger';
import { ChatService } from './chat.service';

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
  @Get()
  getChats(@Query() filter?: ChatDto) {
    const filterQuery = filter || {};
    return this.chatService.listChats(filterQuery);
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
