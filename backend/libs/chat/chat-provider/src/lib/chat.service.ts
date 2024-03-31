import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { ChatTexts } from '@backend/shared/texts';
import { Chatdto, UpdateMessageDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  async create(createChatDto: Chatdto): Promise<Chatdto> {
    const { name } = createChatDto;
    this.logger.verbose({ input: { createChatDto } }, ChatTexts.ATTEMPT_CREATE);
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

  async findOne(id: number) {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_FIND_ONE);
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, ChatTexts.FOUND_ONE);
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_UPDATE);
    this.messages[id] = { ...this.messages[id], ...updateMessageDto };
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, ChatTexts.UPDATED_ONE);
    return message;
  }

  async remove(id: number) {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_DELETE);
    const message = this.messages.splice(id, 1)[0];
    this.logger.verbose({ output: { message } }, ChatTexts.DELETE_ONE);
    return message;
  }

  async identify(name: string, clientId: string) {
    // Use in-memory dictionary to store the reference for client and user
    this.logger.verbose({ input: { name, clientId } }, `Identifing client .`);
    this.clientToUser[clientId] = name;
    const client = Object.values(this.clientToUser);
    this.logger.verbose({ output: { client } }, `Identified client .`);
    return client;
  }

  async getClientName(clientId: string) {
    this.logger.verbose({ input: { clientId } }, `Retrieving client.`);
    const client = this.clientToUser[clientId];
    this.logger.verbose({ output: { client } }, `Found client .`);
    return client;
  }
}
