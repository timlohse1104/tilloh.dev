import {
  CreateMessageDto,
  MessageDto,
  UpdateMessageDto,
} from '@backend/shared-types';
import { Injectable, Logger } from 'npm:@nestjs/common';
import { ChatMongoDbService } from './chat.mongodb.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  /**
   * Creates a new message in a chat.
   *
   * @param chatId The id of the chat in which the message should be created.
   * @param createMessageDto The message to be created.
   * @returns The created message.
   */
  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const { chatId } = createMessageDto;
    this.logger.verbose(
      { input: { chatId, createMessageDto } },
      `Adding new message to chat.`,
    );
    const newMessage = { ...createMessageDto, timestamp: new Date() };
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.messages.push(newMessage);
    const updatedChat = await this.chatMongoDbService.update(chatId, chat);
    const updatedMessage =
      updatedChat.messages[updatedChat.messages.length - 1];
    this.logger.verbose(
      { output: { updatedMessage } },
      `Added new message to chat.`,
    );
    return updatedMessage;
  }

  /**
   * Fetches all messages in a chat.
   *
   * @param chatId The id of the chat.
   * @returns An array of message objects.
   */
  async listMessages(chatId: string) {
    this.logger.verbose({ input: { chatId } }, `Retrieving all messages.`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    const { messages } = chat;
    this.logger.verbose(`Found ${messages.length} messages.`);
    return messages;
  }

  /**
   * Fetches a message by its id in a chat.
   *
   * @param chatId The id of the chat.
   * @param id The id of the message.
   * @returns A single message.
   */
  async findMessage(chatId: string, id: number) {
    this.logger.verbose({ input: { id } }, `Retrieving message.`);
    const message = (await this.chatMongoDbService.findOne(chatId))?.messages[
      id
    ];
    this.logger.verbose({ output: { message } }, `Found message.`);
    return message;
  }

  /**
   * Updates a message in a chat.
   *
   * @param chatId The id of the chat.
   * @param id The id of the message.
   * @param updateMessageDto The message information to be updated.
   * @returns The updated message.
   */
  async updateMessage(
    chatId: string,
    id: number,
    updateMessageDto: UpdateMessageDto,
  ) {
    this.logger.verbose({ input: { id } }, `Updating message .`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.messages[id] = { ...chat.messages[id], ...updateMessageDto };
    const message = chat.messages[id];
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { message } }, `Updated message.`);
    return message;
  }

  /**
   * Deletes a message in a chat.
   *
   * @param chatId The id of the chat.
   * @param id The id of the message.
   * @returns The deleted message.
   */
  async removeMessage(chatId: string, id: number) {
    this.logger.verbose({ input: { id } }, `Removing message.`);
    const chat = await this.chatMongoDbService.findOne(chatId);
    const message = chat.messages.splice(id, 1)[0];
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { message } }, `Removed message.`);
    return message;
  }

  /**
   * Identifies a client in a chat.
   *
   * @param chatId The id of the chat.
   * @param name The name of the client.
   * @param clientId The id of the client.
   * @returns An array of client names.
   */
  async identify(chatId: string, name: string, clientId: string) {
    this.logger.verbose(
      { input: { name, clientId } },
      `Identifing client in chat.`,
    );
    const chat = await this.chatMongoDbService.findOne(chatId);
    chat.clients[clientId] = name;
    const client = Object.values(chat.clients);
    await this.chatMongoDbService.update(chatId, chat);
    this.logger.verbose({ output: { client } }, `Identified client.`);
    return client;
  }

  /**
   * Fetches the name of a client in a chat.
   *
   * @param chatId The id of the chat.
   * @param clientId The id of the client.
   * @returns A single client name.
   */
  async getClientName(chatId: string, clientId: string) {
    this.logger.verbose(
      { input: { clientId } },
      `Retrieving client from chat.`,
    );
    const chat = await this.chatMongoDbService.findOne(chatId);
    const client = chat.clients[clientId];
    this.logger.verbose({ output: { client } }, `Found client.`);
    return client;
  }
}
