import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  connectId: string;

  @Prop({ type: Types.ObjectId, ref: User })
  owner: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
