import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import type { StringValue } from 'ms';

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue;

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'supersecret',
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
