import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JokeDocument = Joke & Document;

@Schema({ collection: 'jokes' })
export class Joke {
  @Prop({ required: true })
  text!: string;

  @Prop({ required: true })
  language!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;

  @Prop({ required: true, default: false })
  verified!: boolean;
}

export const JokeSchema = SchemaFactory.createForClass(Joke);
