import {
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, GetProductsDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('create_product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('get_products')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('get_product_by_id')
  findOne(@Payload('id', ParseIntPipe) id: number): Promise<GetProductsDto> {
    return this.productsService.findOne(id);
  }

  @MessagePattern('update_product_by_id')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern('delete_product_by_id')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern('validate_products')
  validateProducts( @Payload() ids: number[] ) {
    return this.productsService.validateProducts( ids );
  }
}
