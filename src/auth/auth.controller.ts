import { Controller, Post, Body, Get, Param, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<any> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.authService.login(loginDto);
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body() requestDto: PasswordResetRequestDto): Promise<any> {
      try {
        return await this.authService.requestPasswordReset(requestDto);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
        }
        throw error;
      }
    }
    

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
