import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../infrastructure/database/entities/user.entity';

@Injectable()
export class JwtAuthService {
    constructor(private jwtService: JwtService) {}

    createToken(user: User): string {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    validateToken(token: string): any {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
