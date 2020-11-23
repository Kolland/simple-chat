import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { chatsProviders } from '../schemas/chat.providers';
import { messagesProviders } from '../schemas/message.providers';
import { DatabaseModule } from '../database.module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { MessageService } from './message.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ...chatsProviders,
    ChatGateway,
    ...messagesProviders,
    MessageService,
  ],
})
export class ChatModule {}
