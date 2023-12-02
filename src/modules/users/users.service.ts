import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityManager, Connection , Transaction } from 'typeorm';

import { User } from '../../infrastructure/database/entities/user.entity';
import { Profile } from '../../infrastructure/database/entities';
import { Token } from '../../infrastructure/database/entities';

import { CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/requestpass.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { UpdateUserDto } from './dto/update.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';

import { JwtAuthService } from '../../jwt/jwt-auth.service';
import { MailService } from '../../mail/mailer.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ChangePassword } from './dto/chagePass.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        private jwtAuthService: JwtAuthService,
        private sendEmail: MailService,
        private connection: Connection
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({ ...createUserDto, password_hash: hashedPassword });
      return this.userRepository.save(user);
  }

    async createProfile(user: User, createUserDto: CreateUserDto): Promise<Profile> {
      console.log("Entro al create profile")
      const newProfile = this.profileRepository.create({
          user: user,
          first_name: createUserDto.first_name,      
      });
      console.log("profile:", newProfile)
      //manejar errores
      
      await this.profileRepository.save(newProfile);
      return newProfile;
    }

      //login
    async validateUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
      console.log("Entro al validate user")  
      console.log("loginUserDto: ", loginUserDto)
      const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
      console.log("user1: ", user)
      if (!user || !await bcrypt.compare(loginUserDto.password, user.password_hash)) {
            throw new UnauthorizedException('Invalid credentials');
      }
      console.log("user2: ", user)
      const token = this.jwtAuthService.createToken(user);
      const expiresIn = new Date(Date.now() + 3600000); // el token expira en una hora
      
      const tokenEntity = new Token()
      tokenEntity.token = token;
      tokenEntity.type = "access";
      tokenEntity.expires_at = expiresIn;
      tokenEntity.user = user;
      console.log("token: ", tokenEntity)
      // Guardar el token en la base de datos
      await this.tokenRepository.save(tokenEntity);
    
      return {
            accessToken: token,
            expiresIn: expiresIn
      }; 
    }
      

    //crear funcion para cerrar una sesion, recibe un token y lo elimina de la base de datos
    async logout(token: string): Promise<void> {
      console.log("Entro al logout")
      //verificar que el token esta en la base de datos, si no lanzar throw new unauthorized
      const tokenEntry = await this.tokenRepository.findOne({ where: { token: token } });
      if (!tokenEntry) {
        throw new UnauthorizedException('Invalid token');
      }
      //si el token existe, eliminarlo de la base de datos
      await this.tokenRepository.delete({ token });
  }
  
    async createPasswordResetToken(requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
      const user = await this.userRepository.findOne({ where: { email: requestPasswordResetDto.email } });
    
      if (!user) {
          console.log("usuario no encontrado");
          throw new NotFoundException('Correo enviado exitosamente');
      }
      
      const resetCode = crypto.randomBytes(3).toString('hex').slice(0, 6); // Obtiene una cadena de 6 dígitos


      //primero revisar si ya existe un token de reseteo de contraseña para el usuario, en caso de que si eliminar el antiguo, tambien verificar que el type sea igual a "reset"
      const oldToken = await this.tokenRepository.findOne({ where: { user: user, type: "reset" } });
      if (oldToken) {
        await this.tokenRepository.delete({ user: user, type: "reset" });
      }
      const codeToken = new Token()
      const expiresIn = new Date(Date.now() + 3600000); // el token expira en una hora
      codeToken.token = resetCode
      codeToken.type = "reset"
      codeToken.user = user
      codeToken.expires_at = expiresIn
      await this.tokenRepository.save(codeToken);
      await this.sendEmail.sendPasswordResetMail(requestPasswordResetDto.email, codeToken.token);    //servicio de envio de mail
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
      // Verificar que exista el token y cargar la relación del usuario
      const passwordResetEntry = await this.tokenRepository.findOne({
        where: { token: resetPasswordDto.token },
        relations: ['user'], 
      });
    
      if (!passwordResetEntry || passwordResetEntry.expires_at < new Date()) {
        throw new UnauthorizedException('Invalid or expired password reset token');
      }
    
      if (!passwordResetEntry.user) {
        throw new UnauthorizedException('User not found for this token');
      }
    
      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    
      const user = await this.userRepository.findOne({
        where: { id: passwordResetEntry.user.id },
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      user.password_hash = hashedPassword;
      await this.userRepository.save(user);
    
      // Eliminar el token usado
      await this.tokenRepository.delete({ id: passwordResetEntry.id }); // Es mejor usar el ID del token directamente
    }
    

    async deleteUser(id: number): Promise<void> {
        //elmiminar todos los tokens asociados al usuario
        await this.tokenRepository.delete({
          user: { id: id },
        });
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
          await this.profileRepository.delete({ user: user });
          await this.userRepository.delete({ id });
        } else {
          throw new NotFoundException('User not found');
        }
      }
      

      async updateProfileUser(updateUserDto: UpdateUserDto): Promise<{ user: User; profile: Profile }> {
        return this.connection.transaction(async (manager: EntityManager) => {
            // Encuentra el usuario y actualiza su email
            const user = await manager.findOne(User, { where: { id: updateUserDto.userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }
            user.email = updateUserDto.email;
            await manager.save(user);
    
            // Encuentra el perfil asociado y actualiza los detalles
            const profile = await manager.findOne(Profile, { where: { user: { id: updateUserDto.userId } } });
            if (!profile) {
                throw new NotFoundException('Profile not found');
            }
    
            // Actualiza los campos del perfil
            profile.nickname = updateUserDto.nickname;
            profile.first_name = updateUserDto.first_name;
            profile.last_name = updateUserDto.last_name;
            profile.job_position = updateUserDto.job_position;
            profile.location = updateUserDto.location;
            profile.profile_picture = updateUserDto.profile_picture;
            profile.contact = updateUserDto.contact;
    
            await manager.save(profile);
    
            return { user, profile };
        });
    }
     
      async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ 
          where: { id }, 
          relations: ['profile'] 
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return user ;
      }
      

    async changePassword(changePassword: ChangePassword){
      const userId = changePassword.id;
      const user = await this.userRepository.findOne({ where: {id:userId}});

      if (!user){
        throw new NotFoundException ("user not found")
      }

      const passwordValid = await bcrypt.compare(changePassword.password, user.password_hash);

      if (!passwordValid){
        throw new  NotFoundException ('Current Password is incorrect');
      }

      user.password_hash = await bcrypt.hash(changePassword.newPassword, 10);
      await this.userRepository.save(user);
      return {message: 'Password changed successfully'}
    }

    async findOneByEmail(email: string): Promise<User> {
      const user = await this.userRepository.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

}

