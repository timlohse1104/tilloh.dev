import { Message } from './message.entity';

export class Chatdto {
  _id: string;
  name: string;
  messages: Message[];
  created: Date;
}
