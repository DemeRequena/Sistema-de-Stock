import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = { sub: number; role: 'ADMIN' | 'USER' };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'supersecret',
    });
  }

  validate(payload: JwtPayload) {
    // Esto se asigna a req.user
    return { userId: payload.sub, role: payload.role };
  }
}
