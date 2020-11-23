import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData();

    if (!data?.token) {
      throw new WsException('Token is missing');
    }

    let isTokenValid;

    try {
      isTokenValid = this.jwtService.verify(data.token);
    } catch (error) {
      throw new WsException('Invalid credentials');
    }

    return isTokenValid;
  }
}
