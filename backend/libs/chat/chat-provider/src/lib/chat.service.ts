import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { ChatTexts } from '@backend/shared/texts';
import { ChatDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  async create(name: string): Promise<ChatDto> {
    this.logger.verbose({ input: { name } }, ChatTexts.ATTEMPT_CREATE);
    const newChat = await this.chatMongoDbService.create(name);
    this.logger.verbose({ output: { newChat } }, ChatTexts.CREATED_ONE);
    return newChat;
  }

  async findAll() {
    this.logger.verbose(ChatTexts.ATTEMPT_FIND_ALL);
    const chats = await this.chatMongoDbService.findAll();
    this.logger.verbose(`Found ${chats.length} messages.`);
    return chats;
  }

  async findOne(id: string) {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_FIND_ONE);
    const chat = await this.chatMongoDbService.findOne(id);
    this.logger.verbose({ output: { chat } }, ChatTexts.FOUND_ONE);
    return chat;
  }

  async update(id: string, updateChatDto: ChatDto) {
    this.logger.verbose(
      { input: { id, updateMessageDto: updateChatDto } },
      ChatTexts.ATTEMPT_UPDATE
    );
    const chat = await this.chatMongoDbService.update(id, updateChatDto);
    this.logger.verbose({ output: { chat } }, ChatTexts.UPDATED_ONE);
    return chat;
  }

  async remove(id: string) {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_DELETE);
    const chat = await this.chatMongoDbService.remove(id);
    this.logger.verbose({ output: { chat } }, ChatTexts.DELETE_ONE);
    return chat;
  }
}
