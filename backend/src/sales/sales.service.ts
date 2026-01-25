import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    // Validate stock availability for all items first
    for (const item of createSaleDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate total and create sale with items in a transaction
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      // Get product prices and prepare sale items
      const saleItemsData: Array<{
        productId: string;
        quantity: number;
        price: number;
      }> = [];
      
      for (const item of createSaleDto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });

        // Deduct stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock_quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create sale with items
      const sale = await tx.sale.create({
        data: {
          total,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return sale;
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
}
