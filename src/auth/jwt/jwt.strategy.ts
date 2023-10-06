import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAuthService } from './jwt-auth.service';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly jwtAuthService: JwtAuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET_KEY'  //cambiar
        });
    }

    async validate(payload: any) {
        const isValid = this.jwtAuthService.validateToken(payload);
        if (!isValid) {
            throw new UnauthorizedException();
        }
        return await this.userRepository.findOne(payload.sub); // Podemos adjuntar el usuario a la request
    }
}
