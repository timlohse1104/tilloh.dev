import {
  CreateMessageDto,
  IdentifyMessageDto,
  JoinRoomDto,
  TypingDto,
  UpdateMessageDto,
} from '@backend/shared-types';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from 'npm:@nestjs/common';
import { Server, Socket } from 'npm:socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const { name, timestamp } = createMessageDto;

    this.logger.verbose(
      `Creating a new message for ${name} with timestamp ${timestamp}.`,
    );
    const message = await this.messagesService.createMessage(createMessageDto);

    this.logger.verbose(
      `Emit the new message from ${name} to all connected clients.`,
    );
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@MessageBody() chatId: string) {
    this.logger.verbose(`Returning all messages from the database.`);
    return await this.messagesService.listMessages(chatId);
  }

  @SubscribeMessage('findOneMessage')
  async findOne(@MessageBody() identifyMessageDto: IdentifyMessageDto) {
    const { chatId, id } = identifyMessageDto;
    return await this.messagesService.findMessage(chatId, id);
  }

  @SubscribeMessage('updateMessage')
  async update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    const { chatId, id } = updateMessageDto;
    return await this.messagesService.updateMessage(
      chatId,
      id,
      updateMessageDto,
    );
  }

  @SubscribeMessage('removeMessage')
  async remove(@MessageBody() identifyMessageDto: IdentifyMessageDto) {
    const { chatId, id } = identifyMessageDto;
    return await this.messagesService.removeMessage(chatId, id);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { name, chatId } = joinRoomDto;
    this.logger.verbose(`Client ${client.id} joined as ${name}.`);
    return await this.messagesService.identify(chatId, name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { isTyping, chatId } = typingDto;
    const name = await this.messagesService.getClientName(chatId, client.id);
    this.logger.verbose(
      `Emitting typing event from ${name} to all connected clients.`,
    );
    client.broadcast.emit('typing', { name, isTyping });
  }
}
