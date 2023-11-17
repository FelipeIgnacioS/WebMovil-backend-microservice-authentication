import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, Headers } from '@nestjs/common';

import { CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/requestpass.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { UpdateUserDto } from './dto/update.dto';
import { ChangePassword } from './dto/chagePass.dto';

import { UserService } from './users.service';
import { JwtAuthService } from '../../jwt/jwt-auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UserService,
    private jwtAuthService: JwtAuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log("Entro al endpoint de register")
    const user = await this.userService.create(createUserDto);
    console.log("user: ", user)
    const profile = await this.userService.createProfile(user, createUserDto);
    return { Message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.userService.validateUser(loginUserDto);
    return { accessToken: token };
  }

  //Cerrar sesion se debe eliminar el token de la base de datos
  @Post('logout')
  async logout(@Headers('Authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }
    console.log("authHeader: ", authHeader)

    await this.userService.logout(authHeader);
    return { message: 'Logged out successfully' };
  }


  //solicitar restablecimiento de contraseña
  @Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    await this.userService.createPasswordResetToken(requestPasswordResetDto);
    return { message: 'If a user with that email exists, a password reset has been sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.userService.resetPassword(resetPasswordDto);
    return { message: 'Password reset successfully' };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(+id);
    return { message: 'User deleted successfully' };
  }

  @Post('/update')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(updateUserDto.userId, updateUserDto);
    return { updatedUser };
  }

  @Get(':id') // Asume que la URL será algo como /users/1
  async getUser(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }


  //cambiar contraseña con la sesion iniciada
  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePassword) {
    return await this.userService.changePassword(changePasswordDto);
  }
}
