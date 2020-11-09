import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ nickname }).lean().exec();
    if (user && String(user.password) === String(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body: any) {
    const user = await this.validateUser(body.nickname, body.password);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const payload = { nickname: user.nickname, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async signUp(user: any) {
    const existingUser = await this.userModel
      .findOne({ nickname: user.nickname })
      .lean()
      .exec();

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.userModel.create(user);
    return createdUser;
  }
}
