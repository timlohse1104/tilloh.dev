import { Message } from './message.entity';

export class ChatEntityDto {
  _id: string;
  name: string;
  messages: Message[];
  created: Date;
}
