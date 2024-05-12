import { Message } from './message.entity';

export class ChatEntityDto {
  _id: string;
  name: string;
  messages: Message[];
  clients: Record<string, string>;
  created: Date;
}
