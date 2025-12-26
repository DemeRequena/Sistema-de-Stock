import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  sku: string;

  @IsInt()
  @Min(0)
  stockActual: number;

  @IsInt()
  @Min(0)
  stockMinimo: number;
}
