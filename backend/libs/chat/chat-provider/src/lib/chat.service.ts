import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { Chatdto, UpdateMessageDto } from '@backend/shared/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  async create(createChatDto: Chatdto) {
    const { name } = createChatDto;
    this.logger.verbose(
      { input: { createChatDto } },
      `Creating new chat into database.`
    );
    const newChat = await this.chatMongoDbService.create(name);
    newChat.messages.push(newChat);
    this.logger.verbose(
      { output: { newMessage: newChat } },
      `Added new message into database.`
    );
    return newChat;
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
