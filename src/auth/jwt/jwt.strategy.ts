import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Token } from '../entity/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRET_KEY'),
            passReqToCallback: true, 
        });
    }

    async validate(request: any, payload: any) {
        const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    
        const tokenEntry = await this.tokenRepository.findOne({ 
            where: {
                user_id: payload.sub, 
                token: jwtToken 
            }
        });
    
        if (!tokenEntry) {
            throw new UnauthorizedException();
        }
        const currentTimestamp = new Date().getTime();
        if (tokenEntry.expires_at.getTime() < currentTimestamp) {
            throw new UnauthorizedException("Token has expired");
        }
    
        return { userId: tokenEntry.user_id }; // Devuelve solo la información relevante.
    }
    
}
