import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Token } from './entity/token.entity';
import { PasswordReset } from './entity/password-reset.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto} from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginResponseDto } from './dto/login-response,dto';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { MailerService } from './mail/mailer.service';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { CreateProfileDto } from 'src/auth/dto/create-profile.dto';
import { Profile } from 'src/auth/entity/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
        @InjectRepository(PasswordReset) private readonly passwordResetRepository: Repository<PasswordReset>,
        @InjectRepository(Profile) private readonly profileService: Repository<Profile>,
        private readonly jwtAuthService: JwtAuthService,
        private readonly mailerService: MailerService

    ) {}
    
    //metodos de auth
    async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({ ...registerDto, password_hash: hashedPassword });
        const savedUser = await this.userRepository.save(user);

        //crear perfil para el usuario

        const profileData: CreateProfileDto = {
            user: user,
            image: null, 
            name_: registerDto.first_name, 
            nickname: null,
            job_title: null,
            organization: null,
            ubication: null,
            phone: null,
        };

        await this.createProfile(profileData);
        
        return savedUser
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (!user || !await bcrypt.compare(loginDto.password, user.password_hash)) {
            throw new UnauthorizedException('Invalid credentials');
        }
    
        const token = this.jwtAuthService.createToken(user);
        const expiresIn = new Date(Date.now() + 3600000); // el token expira en una hora
    
        // Guardar el token en la base de datos
        const tokenEntity = {
            token: token,
            type: 'JWT', // Asumiendo que es de tipo JWT, ajusta según sea necesario.
            expires_at: expiresIn,
            user_id: user.id
        };
    
        await this.tokenRepository.save(tokenEntity);
    
        return {
            accessToken: token,
            expiresIn: expiresIn
        };
    
      
  }

    async requestPasswordReset(requestDto: PasswordResetRequestDto): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email: requestDto.email } });
    
        if (!user) {
            console.log("usuario no encontrado");
            throw new NotFoundException('User with this email does not exist');
        }
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        const passwordResetEntry = this.passwordResetRepository.create({
            token: resetToken,
            user_id: user.id,
            expires_at: new Date(Date.now() + 3600000) // 1 hora
        });
        await this.passwordResetRepository.save(passwordResetEntry);
        await this.mailerService.sendPasswordResetMail(requestDto.email, resetToken);    //servicio de envio de mail
    }
  

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
      const passwordResetEntry = await this.passwordResetRepository.findOne({ where: { token: resetPasswordDto.token } });
        if (!passwordResetEntry || passwordResetEntry.expires_at < new Date()) {
            throw new UnauthorizedException('Invalid or expired password reset token');
        }
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        const user = await this.userRepository.findOne({ where: { id: passwordResetEntry.user_id } });
        user.password_hash = hashedPassword;
        await this.userRepository.save(user);
        await this.passwordResetRepository.delete(passwordResetEntry.id);
    }

    async findUserById(id: number): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({ where: { id }, select: ['first_name', 'email'] });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    

    //metodos de perfil
    async findById(userId: number): Promise<Profile> {
        const profile = await this.profileService.findOne({ where: { user: { id: userId } } });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return profile;
    }

    async getUserDetails(id: number): Promise<any> {
        const user = await this.userRepository.findOne({ where: { id }, select: ['email'] });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    
        const profile = await this.profileService.findOne({ where: { user: { id } } });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
    
        return {
            ...profile,
            email: user.email,
            name: user.first_name
        };
    }
    
    
    

    async createProfile(profileData: CreateProfileDto): Promise<Profile> {
        const profile = this.profileService.create(profileData);

        try {
            return await this.profileService.save(profile);
        } catch (error) {
            throw new Error(`Error al crear el perfil: ${error.message}`);
        }
    }


    async updateProfile(userId: number, updatedData: UpdateProfileDto): Promise<Profile> {
        const profile = await this.profileService.findOne({ where: { user: { id: userId } } });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // Copia los datos del DTO al perfil.
        Object.assign(profile, updatedData);

        const updatedProfile = await this.profileService.save(profile);
        return updatedProfile;
    }
      
    async updateUser(id: number, updatedData: UpdateUserDto): Promise<User> {
        await this.findById(id); // Verificar si existe
      
        // Actualiza los datos del usuario en la tabla users
        const user = await this.userRepository.findOne({where: { id: id }});
        user.first_name = updatedData.name;
        user.email = updatedData.email;
        await this.userRepository.save(user);
      
        return user;
    }


    async updateProfileImage(userId: number, imagePath: string): Promise<void> {
        await this.profileService.update(userId, { image: imagePath });
    }
}
