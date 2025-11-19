import { Controller, Post, Body, Ip, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(dto, ip);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Ip() ip: string) {
    return this.authService.login(dto, ip);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }
}





