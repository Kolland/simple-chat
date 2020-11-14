import { Inject, Injectable } from '@nestjs/common';
import { Chat } from '../schemas/chat.schema';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_MODEL')
    private chatModel: Model<Chat>,
  ) {}

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
}
