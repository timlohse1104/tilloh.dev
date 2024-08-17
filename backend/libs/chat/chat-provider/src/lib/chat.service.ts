import { ChatMongoDbService } from '@backend/chat/chat-persistence';
import { ChatTexts } from '@backend/shared-texts';
import { ChatEntityDto, FindAllChatsOptions } from '@backend/shared-types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private chatMongoDbService: ChatMongoDbService) {}

  /**
   * Creates a chat.
   *
   * @param name The name of the chat.
   * @returns The created chat.
   */
  async createChat(name: string): Promise<ChatEntityDto> {
    this.logger.verbose({ input: { name } }, ChatTexts.ATTEMPT_CREATE);
    const newChat = await this.chatMongoDbService.create(name);
    this.logger.verbose({ output: { newChat } }, ChatTexts.CREATED_ONE);
    return newChat;
  }

  /**
   * Fetches all chats.
   *
   * @param options Optional filter for a specific client.
   * @returns An array of chat objects.
   */
  async listChats(options?: FindAllChatsOptions): Promise<ChatEntityDto[]> {
    this.logger.verbose(ChatTexts.ATTEMPT_FIND_ALL);
    const chats = await this.chatMongoDbService.findAll(options);
    this.logger.verbose(`Found ${chats.length} messages.`);
    return chats;
  }

  /**
   * Fetches a chat by its id.
   *
   * @param id The id of the chat.
   * @returns A single chat.
   */
  async findChat(id: string): Promise<ChatEntityDto> {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_FIND_ONE);
    const chat = await this.chatMongoDbService.findOne(id);
    this.logger.verbose({ output: { chat } }, ChatTexts.FOUND_ONE);
    return chat;
  }

  /**
   * Updates a chat.
   *
   * @param id The id of the chat.
   * @param updateChatDto The chat information to be updated.
   * @returns The updated chat.
   */
  async updateChat(
    id: string,
    updateChatDto: ChatEntityDto,
  ): Promise<ChatEntityDto> {
    this.logger.verbose(
      { input: { id, updateMessageDto: updateChatDto } },
      ChatTexts.ATTEMPT_UPDATE,
    );
    const chat = await this.chatMongoDbService.update(id, updateChatDto);
    this.logger.verbose({ output: { chat } }, ChatTexts.UPDATED_ONE);
    return chat;
  }

  /**
   * Deletes a chat.
   *
   * @param id The id of the chat.
   * @returns The deleted chat.
   */
  async removeChat(id: string): Promise<ChatEntityDto> {
    this.logger.verbose({ input: { id } }, ChatTexts.ATTEMPT_DELETE);
    const chat = await this.chatMongoDbService.remove(id);
    this.logger.verbose({ output: { chat } }, ChatTexts.DELETE_ONE);
    return chat;
  }
}
