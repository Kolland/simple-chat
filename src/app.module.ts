import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { usersProviders } from './schemas/users.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ...usersProviders],
})
export class AppModule {}
