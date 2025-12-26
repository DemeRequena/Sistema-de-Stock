import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, StockMovementsModule],
})
export class AppModule {}
