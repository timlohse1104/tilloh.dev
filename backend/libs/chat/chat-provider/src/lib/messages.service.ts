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
    this.logger.verbose({ input: { chatId } }, `Retrieving all messages.`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    const { messages } = chat;
    this.logger.verbose(`Found ${messages.length} messages.`);
    return messages;
  }

  async findOne(chatId: string, id: number) {
    this.logger.verbose({ input: { id } }, `Retrieving message.`);
    const message = (await this.chatMongoDbService.findOne(chatId))?.messages[
      id
    ];
    this.logger.verbose({ output: { message } }, `Found message.`);
    return message;
  }

  async update(chatId: string, id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.verbose({ input: { id } }, `Updating message .`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.messages[id] = { ...chat.messages[id], ...updateMessageDto };
    const message = chat.messages[id];
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { message } }, `Updated message.`);
    return message;
  }

  async remove(chatId: string, id: number) {
    this.logger.verbose({ input: { id } }, `Removing message.`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    const message = chat.messages.splice(id, 1)[0];
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { message } }, `Removed message.`);
    return message;
  }

  async identify(chatId: string, name: string, clientId: string) {
    this.logger.verbose(
      { input: { name, clientId } },
      `Identifing client in chat.`
    );
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.clients[clientId] = name;
    const client = Object.values(chat.clients);
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { client } }, `Identified client.`);
    return client;
  }

  async getClientName(chatId: string, clientId: string) {
    this.logger.verbose(
      { input: { clientId } },
      `Retrieving client from chat.`
    );
    const chat = await this.chatMongoDbService.findOne(chatId);
    const client = chat.clients[clientId];
    this.logger.verbose({ output: { client } }, `Found client.`);
    return client;
  }
}
