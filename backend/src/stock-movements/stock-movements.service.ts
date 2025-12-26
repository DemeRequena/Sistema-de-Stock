import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(productId?: number) {
    return this.prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }

  async create(userId: number, dto: CreateStockMovementDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Product not found');
      if (!product.active) throw new BadRequestException('Product is disabled');

      const currentStock = product.stockActual;
      const nextStock =
        dto.type === 'IN' ? currentStock + dto.quantity : currentStock - dto.quantity;

      if (nextStock < 0) {
        throw new BadRequestException('Insufficient stock');
      }

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { stockActual: nextStock },
      });

      const movement = await tx.stockMovement.create({
        data: {
          type: dto.type,
          quantity: dto.quantity,
          userId,
          productId: product.id,
        },
      });

      return { movement, product: updatedProduct };
    });
  }
}
