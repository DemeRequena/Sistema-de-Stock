import { IsIn, IsInt, Min } from 'class-validator';

export class CreateStockMovementDto {
  @IsInt()
  productId: number;

  @IsIn(['IN', 'OUT'])
  type: 'IN' | 'OUT';

  @IsInt()
  @Min(1)
  quantity: number;
}
