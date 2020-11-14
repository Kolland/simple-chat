import { ChatModule } from './chat/chat.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { usersProviders } from './schemas/users.providers';
import { chatsProviders } from './schemas/chat.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [ChatModule, AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ...usersProviders, ...chatsProviders],
})
export class AppModule {}
