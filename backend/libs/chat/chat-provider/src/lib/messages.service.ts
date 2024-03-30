import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import {
  CreateMessageDto,
  Message,
  UpdateMessageDto,
} from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  // In-memory database
  messages: Message[] = [
    { name: 'Alice', text: 'Hej Bob :)', timestamp: new Date() },
    {
      name: 'Bob',
      text: 'Moin Alice!',
      timestamp: new Date(Date.now() + 5000),
    },
  ];
  clientToUser: Record<string, string> = {};

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  create(createMessageDto: CreateMessageDto) {
    const { name } = createMessageDto;
    this.logger.verbose(
      { input: { createMessageDto } },
      `Adding new message into database.`
    );
    const newMessage = { ...createMessageDto, timestamp: new Date() };
    this.messages.push(newMessage);
    this.logger.verbose(
      { output: { newMessage } },
      `Added new message into database.`
    );
    return newMessage;
  }

  findAll() {
    this.logger.verbose(`Finding all messages from database.`);
    const messages = this.messages;
    this.logger.verbose(`Found ${messages.length} messages in database.`);
    return messages;
  }

  findOne(id: number) {
    this.logger.verbose({ input: { id } }, `Retrieving message from database.`);
    const message = this.messages[id];
    this.logger.verbose({ output: { message } }, `Found message in database.`);
    return message;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.verbose({ input: { id } }, `Updating message in database.`);
    this.messages[id] = { ...this.messages[id], ...updateMessageDto };
    const message = this.messages[id];
    this.logger.verbose(
      { output: { message } },
      `Updated message from database.`
    );
    return message;
  }

  remove(id: number) {
    this.logger.verbose(
      { input: { id } },
      `Removing message with from database.`
    );
    const message = this.messages.splice(id, 1)[0];
    this.logger.verbose(
      { output: { message } },
      `Removed message from database.`
    );
    return message;
  }

  identify(name: string, clientId: string) {
    // Use in-memory dictionary to store the reference for client and user
    this.logger.verbose(
      { input: { name, clientId } },
      `Identifing client in database.`
    );
    this.clientToUser[clientId] = name;
    const client = Object.values(this.clientToUser);
    this.logger.verbose(
      { output: { client } },
      `Identified client in database.`
    );
    return client;
  }

  getClientName(clientId: string) {
    this.logger.verbose(
      { input: { clientId } },
      `Retrieving client from database.`
    );
    const client = this.clientToUser[clientId];
    this.logger.verbose({ output: { client } }, `Found client in database.`);
    return client;
  }
}
