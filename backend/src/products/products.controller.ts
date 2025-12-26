import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /products?activeOnly=true
  @Get()
  list(@Query('activeOnly', new ParseBoolPipe({ optional: true })) activeOnly?: boolean) {
    return this.productsService.list(activeOnly);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  // ADMIN only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // ADMIN only
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  // ADMIN only
  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.disable(id);
  }
}
