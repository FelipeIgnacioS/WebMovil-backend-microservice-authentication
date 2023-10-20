import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { ImageUploadMiddleware } from './middleware/image-upload.middleware';
import { Profile } from './entity/profile.entity';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Token, PasswordReset, Profile]),
        PassportModule,
        JwtModule.register({
            secret: 'futbolitos',  //Clave real
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthService, JwtStrategy, MailerService, ConfigService],
    exports: []  
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ImageUploadMiddleware)
            .forRoutes({ path: 'profile/upload/:id', method: RequestMethod.POST });
    }
}
