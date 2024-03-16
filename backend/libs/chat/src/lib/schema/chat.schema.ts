import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ _id: false, collection: 'chats' })
export class Chat {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: () => [] })
  messages: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
