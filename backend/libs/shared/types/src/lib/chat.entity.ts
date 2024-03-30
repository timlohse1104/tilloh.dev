import { Message } from './message.entity';

export class Chat {
  _id: string;
  name: string;
  messages: Message[];
  created: Date;
}
