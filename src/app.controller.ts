import { BadRequestException } from '@nestjs/common';
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('auth/sign-up')
  async signUp(@Request() req) {
    if (!req.body?.nickname) {
      throw new BadRequestException('nickname is required');
    }

    if (!req.body?.password) {
      throw new BadRequestException('password is required');
    }

    return this.authService.signUp(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
