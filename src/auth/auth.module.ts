import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database.module';
import { usersProviders } from 'src/schemas/users.providers';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    DatabaseModule,
  ],
  providers: [AuthService, JwtStrategy, ...usersProviders],
  exports: [AuthService],
})
export class AuthModule {}
