import { Inject, Injectable } from '@nestjs/common';
import { Chat } from '../schemas/chat.schema';
import { Model, Types } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { UserDocument } from '../schemas/user.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_MODEL')
    private chatModel: Model<Chat>,
    @Inject('MESSAGE_MODEL')
    private messageModel: Model<Message>,
  ) {}

  async getByConnectId(connectId: string) {
    const chat = await this.chatModel.findOne({
      connectId,
    });
    return chat;
  }

  async create(user: UserDocument) {
    const nanoid = customAlphabet('1234567890', 4);
    const connectId = nanoid();
    const owner = user._id;
    const createdChat = await this.chatModel.create({
      connectId,
      owner,
    });
    return createdChat;
  }

  async history(id: string) {
    const messages = await this.messageModel
      .find({
        chat: Types.ObjectId(id),
      })
      .populate('user')
      .populate('chat');

    return messages;
  }
}
