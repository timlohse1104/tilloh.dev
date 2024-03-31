import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { CreateMessageDto, UpdateMessageDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  clientToUser: Record<string, string> = {};

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  create(createMessageDto: CreateMessageDto) {
    const { name } = createMessageDto;
    this.logger.verbose({ input: { createMessageDto } }, `Adding new message.`);
    const newMessage = { ...createMessageDto, timestamp: new Date() };
    this.messages.push(newMessage);
    this.logger.verbose({ output: { newMessage } }, `Added new message.`);
    return newMessage;
  }

  findAll() {
    this.logger.verbose(`Finding all messages.`);
    const messages = this.messages;
    this.logger.verbose(`Found ${messages.length} messages .`);
    return messages;
  }

  findOne(id: number) {
    this.logger.verbose({ input: { id } }, `Retrieving message.`);
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, `Found message .`);
    return message;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.verbose({ input: { id } }, `Updating message .`);
    this.messages[id] = { ...this.messages[id], ...updateMessageDto };
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, `Updated message.`);
    return message;
  }

  remove(id: number) {
    this.logger.verbose({ input: { id } }, `Removing message with.`);
    const message = this.messages.splice(id, 1)[0];
    this.logger.verbose({ output: { message } }, `Removed message.`);
    return message;
  }

  identify(name: string, clientId: string) {
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
