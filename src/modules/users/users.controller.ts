import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, Headers, Put } from '@nestjs/common';

import { CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/requestpass.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { UpdateUserDto } from './dto/update.dto';
import { ChangePassword } from './dto/chagePass.dto';

import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UserService,
  ) {}
  
  //registrar
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log("Entro al endpoint de register")
    const user = await this.userService.create(createUserDto);
    console.log("user: ", user)
    const profile = await this.userService.createProfile(user, createUserDto);
    return { Message: 'User registered successfully' };
  }

  //logearse
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
    return { message: 'Si el usuario existe, se ha enviado un codigo de restablecimiento' };
  }

  //reiniciar contraseña con codigo
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.userService.resetPassword(resetPasswordDto);
    return { message: 'Contraseña restablecida correctamente' };
  }
  //eliminar un usuario y profile
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(+id);
    return { message: 'Usuario eleiminado correctamente' };
  }
  //actualizar datos del perfil. puede ser tanto como el correo de la tabla users, como los datos personales de la tabla profile
  @Put('/:id')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateProfileUser (updateUserDto);
    return { message: 'Usuario actualizado correctamente' };
  }

  //obtener todos los datos de un usuario por su id, en tabla user y profile
  @Get(':id') 
  async getUser(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }


  //cambiar contraseña con la sesion iniciada
  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePassword) {
    await this.userService.changePassword(changePasswordDto);
    return{ message: 'Contraseña cambiada correctamente' };
  }

  //obtener un usuario por su correo electronico
  @Get("/email/:email")
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findOneByEmail(email);
  }

}
