import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req) {
    return this.chatService.create(req.user);
  }

  @Get(':connectId')
  async history(@Param() params) {
    const chat = await this.chatService.getByConnectId(params.connectId);
    if (!chat) {
      throw new NotFoundException(
        `Chat with connectId ${params.connectId} not found`,
      );
    }

    return this.chatService.history(chat._id);
  }
}
