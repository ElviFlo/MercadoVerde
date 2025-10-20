import { PrismaClient, Prisma, Product } from '@prisma/client';
import { CreateProductDTO } from '../../application/dtos/CreateProductDTO';

export class ProductRepository {
  private prisma = new PrismaClient();

  async create(data: CreateProductDTO): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: new Prisma.Decimal(data.price),
        categoryId: data.categoryId ?? null,
        createdBy: data.createdBy ?? 'unknown',
        active: data.active ?? true,
        stock: data.stock ?? 0,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        active: true,
        stock: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}
