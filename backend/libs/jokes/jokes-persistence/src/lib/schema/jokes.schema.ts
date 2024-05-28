import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JokeDocument = Joke & Document;

@Schema({ _id: false, collection: 'jokes' })
export class Joke {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ required: true })
  language!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;
}

export const JokeSchema = SchemaFactory.createForClass(Joke);
