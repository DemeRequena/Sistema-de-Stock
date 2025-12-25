import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [AuthModule],
})
export class AppModule {}
