import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { TypingDto } from './dto/typing.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    @InjectPinoLogger(MessagesGateway.name)
    private readonly logger: PinoLogger
  ) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const { name, timestamp } = createMessageDto;

    this.logger.trace(
      `Creating a new message for ${name} with timestamp ${timestamp}.`
    );
    const message = await this.messagesService.create(createMessageDto);

    this.logger.trace(
      `Emit the new message from ${name} to all connected clients.`
    );
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    this.logger.trace(`Returning all messages from the database.`);
    return this.messagesService.findAll();
  }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    this.logger.trace(`Removing message with id ${id} from database.`);
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket
  ) {
    const { name } = joinRoomDto;
    this.logger.trace(`Client ${client.id} joined as ${name}.`);
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket
  ) {
    const { isTyping } = typingDto;
    const name = await this.messagesService.getClientName(client.id);
    this.logger.trace(
      `Emitting typing event from ${name} to all connected clients.`
    );
    client.broadcast.emit('typing', { name, isTyping });
  }
}
