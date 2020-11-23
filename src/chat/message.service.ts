import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Message } from 'src/schemas/message.schema';
import { Document, Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGE_MODEL')
    private messageModel: Model<Message>,
  ) {}

  async create(userId: string, message: string, chatId: string) {
    const createdMessage = await this.messageModel.create({
      user: Types.ObjectId(userId),
      chat: Types.ObjectId(chatId),
      message,
    });
    return createdMessage;
  }
}
