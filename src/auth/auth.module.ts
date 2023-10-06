import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

import { User } from './entity/user.entity';
import { Token } from './entity/token.entity';
import { PasswordReset } from './entity/password-reset.entity';
import { MailerService } from './mail/mailer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Token, PasswordReset]),
        PassportModule,
        JwtModule.register({
            secret: 'SECRET_KEY',  //Clave real
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthService, JwtStrategy, MailerService],
    exports: []  
})
export class AuthModule {}
