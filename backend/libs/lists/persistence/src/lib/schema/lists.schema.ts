import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

export class ListEntry {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  quantity?: number;

  @Prop({ required: false })
  unit?: string;

  @Prop({ required: false })
  checked?: boolean;

  @Prop({ required: false })
  deleted?: boolean;
}

@Schema({ collection: 'lists' })
export class List {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'list' })
  icon: string;

  @Prop({ required: true, default: [] })
  members: string[];

  @Prop({ required: true, default: [] })
  entries: ListEntry[];

  @Prop({ type: Date, required: true, default: () => new Date() })
  created: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);
