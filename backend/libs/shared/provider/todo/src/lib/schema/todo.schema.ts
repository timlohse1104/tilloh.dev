import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SharedTodoListDocument = SharedTodoList & Document;

class TodoItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  done?: boolean;

  @Prop({ required: false })
  amount?: string;

  @Prop({ required: false })
  category?: string;
}

@Schema({ collection: 'shared_todo_lists' })
export class SharedTodoList {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  emoji!: string;

  @Prop({ type: [TodoItem], required: true, default: [] })
  todos!: TodoItem[];

  @Prop({ type: [String], required: false, default: [] })
  history?: string[];

  @Prop({ type: Number, required: true, default: 1 })
  version!: number;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;
}

export const SharedTodoListSchema = SchemaFactory.createForClass(SharedTodoList);