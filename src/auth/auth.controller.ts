import { Controller, Post, Body, Get, Param, NotFoundException, HttpException, HttpStatus, Put, UseInterceptors, UploadedFile, UseGuards, Request, UnauthorizedException, BadRequestException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get('user-details')
    async getUserProfileDetails(@Request() req): Promise<any> {
        const userId = req.user.userId;
        return this.authService.getUserDetails(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate-token')
    getValidateToken(@Req() req) {
        return {
            isValid: true,
            userId: req.user.userId
        };
    }

    
    @UseGuards(JwtAuthGuard)  // Asegura que solo los usuarios autenticados puedan acceder a este endpoint
    @Get('user/:id')
    async getUser(@Param('id') id: number) {
        return this.authService.findUserById(id);
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
    @Put('profile/:id')
    async updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @Request() req) {
        
        const userId = Number(id);
        console.log(userId);
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid ID provided');
        }
        const { name_, nickname, job_title, organization, ubication, phone } = updateProfileDto;
        
        const profile = await this.authService.updateProfile(userId, updateProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('user/:id')
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
        const { name, email } = updateUserDto;

        // Actualiza los datos del usuario en la tabla users
        const user = await this.authService.updateUser(id, updateUserDto);

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