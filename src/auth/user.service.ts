import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async get(id: string): Promise<UserDocument> {
    const chat = await this.userModel.findById(id);
    return chat;
  }
}
