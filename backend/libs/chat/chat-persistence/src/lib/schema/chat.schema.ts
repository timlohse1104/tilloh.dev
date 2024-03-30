import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: [ChatMessage], required: true, default: () => [] })
  messages: ChatMessage[];

  @Prop({ type: Date, required: true, default: () => new Date() })
  created: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
