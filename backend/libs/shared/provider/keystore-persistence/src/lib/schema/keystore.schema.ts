import { Prop, Schema, SchemaFactory } from 'npm:@nestjs/mongoose';
import { Document } from 'npm:mongoose';

export type KeystoreDocument = Keystore & Document;

@Schema({ _id: false, collection: 'keystore' })
export class Keystore {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true })
  identifier: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  created: Date;

  @Prop({ type: Date, required: true, default: () => new Date() })
  updated: Date;
}

export const KeystoreSchema = SchemaFactory.createForClass(Keystore).index(
  { identifier: 1, key: 1 },
  { unique: true },
);
