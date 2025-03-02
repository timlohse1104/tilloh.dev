import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

export class ListEntry {
  @Prop({ required: true, default: () => randomUUID() })
  _id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, default: false })
  done!: boolean;

  @Prop({ required: true })
  author!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;
}

@Schema({ collection: 'lists' })
export class List {
  @Prop({ required: true, default: () => randomUUID() })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, default: '📝' })
  emoji!: string;

  @Prop({ required: true })
  owner!: string;

  @Prop({ required: true, default: [] })
  invited!: string[];

  @Prop({ type: [ListEntry], required: true, default: [] })
  entries!: ListEntry[];

  @Prop({ required: true, default: [] })
  history!: string[];

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);
