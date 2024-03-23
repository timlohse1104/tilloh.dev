import { CreateMessageDto, Message } from '@backend/shared/types';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class MessagesService {
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

  constructor(
    @InjectPinoLogger(MessagesService.name)
    private readonly logger: PinoLogger
  ) {}

  create(createMessageDto: CreateMessageDto) {
    const { name } = createMessageDto;
    this.logger.trace(`Adding new message from ${name} to database.`);
    const newMessage = { ...createMessageDto, timestamp: new Date() };
    this.messages.push(newMessage);
    this.logger.trace(`Returning new message from ${name}.`);
    return newMessage;
  }

  findAll() {
    return this.messages;
  }

  findOne(id: number) {
    this.logger.trace(`Retrieving message with id ${id} from database.`);
    const message = this.messages[id];
    this.logger.trace(`Adding new message from ${name} to database.`);
    return message;
  }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }

  identify(name: string, clientId: string) {
    // Use in-memory dictionary to store the reference for client and user
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
