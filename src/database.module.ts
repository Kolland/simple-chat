import { Module } from '@nestjs/common';
import { databaseProviders } from './schemas/database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
