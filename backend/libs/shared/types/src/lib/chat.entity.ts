import { Message } from './message.entity';

export class ChatDto {
  _id: string;
  name: string;
  messages: Message[];
  created: Date;
}
