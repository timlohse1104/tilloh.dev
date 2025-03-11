import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IdentifierDocument = Identifier & Document;

@Schema({ _id: false, collection: 'identifiers' })
export class Identifier {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created!: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated!: Date;
}

export const IdentifierSchema = SchemaFactory.createForClass(Identifier);
