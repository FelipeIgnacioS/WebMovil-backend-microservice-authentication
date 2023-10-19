import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.entity';

@Injectable()
export class JwtAuthService {
    constructor(private jwtService: JwtService) {}

    createToken(user: User): string {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    validateToken(payload: any): boolean {
        return !!payload && !!payload.sub;
    }
}