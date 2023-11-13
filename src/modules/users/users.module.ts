
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { User, Profile, Token } from '../../infrastructure/database/entities';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../../mail/mailer.service'; // Assuming you have a MailModule that provides MailerService
import { JwtAuthService } from 'src/jwt/jwt-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Token]),
    JwtModule.register({
      secret: 'futbolitos',
      signOptions: { expiresIn: '1h' }
    }), 
  ],
  controllers: [UsersController],
  providers: [ UserService, MailService, JwtAuthService],
  exports: [UserService],
})
export class UsersModule {}
