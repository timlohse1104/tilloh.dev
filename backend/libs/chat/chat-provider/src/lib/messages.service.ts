import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import {
  CreateMessageDto,
  MessageDto,
  UpdateMessageDto,
} from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  clientToUser: Record<string, string> = {};

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  async create(
    chatId: string,
    createMessageDto: CreateMessageDto
  ): Promise<MessageDto> {
    this.logger.verbose(
      { input: { chatId, createMessageDto } },
      `Adding new message to chat.`
    );
    const newMessage = { ...createMessageDto, timestamp: new Date() };
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.messages.push(newMessage);
    const updatedChat = await this.chatMongoDbService.update(chatId, chat);
    const updatedMessage =
      updatedChat.messages[updatedChat.messages.length - 1];
    this.logger.verbose(
      { output: { updatedMessage } },
      `Added new message to chat.`
    );
    return updatedMessage;
  }

  async findAll(chatId: string) {
    this.logger.verbose(`Finding all messages.`);
    const messages = this.messages;
    this.logger.verbose(`Found ${messages.length} messages .`);
    return messages;
  }

  async findOne(chatId: string, id: number) {
    this.logger.verbose({ input: { id } }, `Retrieving message.`);
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, `Found message .`);
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.verbose({ input: { id } }, `Updating message .`);
    this.messages[id] = { ...this.messages[id], ...updateMessageDto };
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, `Updated message.`);
    return message;
  }

  async remove(id: number) {
    this.logger.verbose({ input: { id } }, `Removing message with.`);
    const message = this.messages.splice(id, 1)[0];
    this.logger.verbose({ output: { message } }, `Removed message.`);
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

  getClientName(clientId: string) {
    this.logger.verbose({ input: { clientId } }, `Retrieving client.`);
    const client = this.clientToUser[clientId];
    this.logger.verbose({ output: { client } }, `Found client .`);
    return client;
  }
}
