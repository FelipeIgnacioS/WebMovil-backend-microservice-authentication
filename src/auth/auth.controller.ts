import { Controller, Post, Body, Get, Param, NotFoundException, HttpException, HttpStatus, Put, UseInterceptors, UploadedFile, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //autenticación
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

    @Get('validate-token')
    @UseGuards(JwtAuthGuard) 
    async validateToken() {
        return { message: 'Token is valid' };
    }


    //perifl
    @Get(':id')
    async getProfile(@Param('id') id: number) {
        return this.authService.findById(id);
    }

    @Post()
    async createProfile(@Body() createProfileDto: CreateProfileDto) {
        return this.authService.createProfile(createProfileDto);
    }

    @UseGuards(JwtAuthGuard)  
    @Put(':id')
    async updateProfile(@Param('id') id: number, @Body() updateProfileDto: CreateProfileDto, @Request() req) {
        if(req.user.id !== id) {
            throw new UnauthorizedException('You can only update your own profile');
        }
        return this.authService.updateProfile(id, updateProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('image'))
    async uploadProfileImage(@Param('id') id: number, @UploadedFile() file, @Request() req) {
        if(req.user.id !== id) {
            throw new UnauthorizedException('You can only upload images for your own profile');
        }
        const imagePath = file.path;
        await this.authService.updateProfileImage(id, imagePath);
        return { path: imagePath };
    }
}