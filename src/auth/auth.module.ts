import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database.module';
import { usersProviders } from 'src/schemas/users.providers';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtSocketAuthGuard } from './jwt-socket-auth.guard';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    DatabaseModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ...usersProviders,
    JwtSocketAuthGuard,
    UserService,
  ],
  exports: [AuthService, UserService, JwtModule],
})
export class AuthModule {}
