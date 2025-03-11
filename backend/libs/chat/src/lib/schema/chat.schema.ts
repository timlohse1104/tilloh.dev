import { Prop, Schema, SchemaFactory } from 'npm:@nestjs/mongoose';
import { Document } from 'npm:mongoose';

export type ChatDocument = Chat & Document;

export class ChatMessage {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5000),
  })
  timestamp: Date;
}

@Schema({ _id: false, collection: 'chats' })
export class Chat {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [ChatMessage], required: true, default: [] })
  messages: ChatMessage[];

  @Prop({ type: Map, of: String, default: {} })
  clients: Record<string, string>;

  @Prop({ type: Date, required: true, default: new Date() })
  created: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  updated: Date;

  @Prop({ required: true })
  emoji: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  securityQuestion: string;

  @Prop({ required: true })
  securityAnswer: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
