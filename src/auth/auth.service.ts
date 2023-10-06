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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
        @InjectRepository(PasswordReset) private readonly passwordResetRepository: Repository<PasswordReset>,
        private readonly jwtAuthService: JwtAuthService,
        private readonly mailerService: MailerService

    ) {}

    async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({ ...registerDto, password_hash: hashedPassword });
        return this.userRepository.save(user);
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
      const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
      if (!user || !await bcrypt.compare(loginDto.password, user.password_hash)) {
          throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtAuthService.createToken(user);
      return {
          accessToken: token,
          expiresIn: new Date(Date.now() + 3600000) // el token expira en una hora
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
        //await this.mailerService.sendPasswordResetMail(requestDto.email, resetToken);    //servicio de envio de mail
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
}
