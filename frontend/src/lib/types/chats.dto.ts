export class MessageDto {
  name: string;
  text: string;
  timestamp: string;
}

export class ChatDto {
  _id: string;
  name: string;
  messages: MessageDto[];
  created: string;
  updated: string;
}
