import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected`);
  }

  create(createProductDto: CreateProductDto) {
    const createProduct = this.product.create({
      data: createProductDto,
    });

    return createProduct;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        lastPage: lastPage,
        page: page,
      },
    };
  }

  async findOne(id: number) {
    const productfinded = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!productfinded) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return productfinded;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const productUpdated = await this.product.update({
      where: { id: updateProductDto.id },
      data: updateProductDto,
    });

    return productUpdated;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.product.update({
      where: { id },
      data: { available: false },
    });

    return `Product with id #${id} deleted`;
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: `Product with id #${ids} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return products;
  }
}
