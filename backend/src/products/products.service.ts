import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCT_CACHE_PREFIX = 'product:';
const CACHE_TTL = 3600; // 1 hour

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    // Invalidate cache
    await this.invalidateCache();

    return product;
  }

  async findAll() {
    // Try to get from cache first
    const cached = await this.redis.get(PRODUCTS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, fetch from database
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Store in cache
    await this.redis.set(PRODUCTS_CACHE_KEY, JSON.stringify(products), CACHE_TTL);

    return products;
  }

  async findOne(id: string) {
    // Try cache first
    const cacheKey = `${PRODUCT_CACHE_PREFIX}${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache the product
    await this.redis.set(cacheKey, JSON.stringify(product), CACHE_TTL);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Invalidate cache
    await this.invalidateCache(id);

    return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    const product = await this.prisma.product.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateCache(id);

    return product;
  }

  async invalidateCache(id?: string) {
    // Invalidate all products list
    await this.redis.del(PRODUCTS_CACHE_KEY);
    
    // If specific product, invalidate that too
    if (id) {
      await this.redis.del(`${PRODUCT_CACHE_PREFIX}${id}`);
    }
  }
}
