import { MessagesService } from '@backend/chat/chat-provider';
import {
  CreateMessageDto,
  IdentifyMessageDto,
  JoinRoomDto,
  TypingDto,
  UpdateMessageDto,
} from '@backend/shared/types';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    const { chatId, name, timestamp } = createMessageDto;

    this.logger.verbose(
      `Creating a new message for ${name} with timestamp ${timestamp}.`
    );
    const message = await this.messagesService.create(chatId, createMessageDto);

    this.logger.verbose(
      `Emit the new message from ${name} to all connected clients.`
    );
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody() chatId: string) {
    this.logger.verbose(`Returning all messages from the database.`);
    return this.messagesService.findAll(chatId);
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() identifyMessageDto: IdentifyMessageDto) {
    const { chatId, id } = identifyMessageDto;
    return this.messagesService.findOne(chatId, id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    const { chatId, id } = updateMessageDto;
    return this.messagesService.update(chatId, id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() identifyMessageDto: IdentifyMessageDto) {
    const { chatId, id } = identifyMessageDto;
    return this.messagesService.remove(chatId, id);
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket
  ) {
    const { name } = joinRoomDto;
    this.logger.verbose(`Client ${client.id} joined as ${name}.`);
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket
  ) {
    const { isTyping } = typingDto;
    const name = await this.messagesService.getClientName(client.id);
    this.logger.verbose(
      `Emitting typing event from ${name} to all connected clients.`
    );
    client.broadcast.emit('typing', { name, isTyping });
  }
}
