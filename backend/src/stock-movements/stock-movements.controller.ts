import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

type AuthUser = { userId: number; role: 'ADMIN' | 'USER' };
type RequestWithUser = { user: AuthUser };

@Controller('stock-movements')
@UseGuards(JwtAuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  list(@Query('productId') productId?: string) {
    return this.stockMovementsService.list(productId ? Number(productId) : undefined);
  }

  @Post()
  create(@Request() req: RequestWithUser, @Body() dto: CreateStockMovementDto) {
    return this.stockMovementsService.create(req.user.userId, dto);
  }
}
