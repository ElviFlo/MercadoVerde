// src/infrastructure/repositories/product.repository.ts

import { PrismaClient } from "@prisma/client";
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/IProductRepository";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

function toDomain(p: any): Product {
  const rawPrice = p.price;
  const price =
    rawPrice &&
    typeof rawPrice === "object" &&
    typeof rawPrice.toNumber === "function"
      ? rawPrice.toNumber()
      : Number(rawPrice ?? 0);

  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    price,
    productCategoryId: p.categoryId ?? null,
    categoryId: p.categoryId ?? null,
    createdBy: p.createdBy,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    active: p.active,
    stock: p.stock,

    // 👇 nuevos campos en el dominio
    type: p.type,
    imageUrl: p.imageUrl ?? "/plants/plant-placeholder.png",
  };
}

export class PrismaProductRepository implements ProductRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    const price =
      typeof data.price === "string"
        ? parseFloat(data.price) || 0
        : data.price ?? 0;

    const categoryId = data.productCategoryId ?? data.categoryId ?? null;

    const type = data.type ?? "general";

    const imageUrl =
      typeof data.imageUrl === "string" && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : "/plants/plant-placeholder.png";

    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price,
        categoryId,
        createdBy: data.createdBy ?? "unknown",
        active: data.active ?? true,
        stock: data.stock ?? 0,
        type,
        imageUrl,
      },
    });

    return toDomain(created);
  }

  async findAll(): Promise<Product[]> {
    const list = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return list.map(toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({ where: { id } });
    return p ? toDomain(p) : null;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description ?? null;
    }

    if (data.price !== undefined) {
      updateData.price =
        typeof data.price === "string"
          ? parseFloat(data.price)
          : data.price;
    }

    const categoryId = data.productCategoryId ?? data.categoryId ?? undefined;
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId;
    }

    if (data.active !== undefined) {
      updateData.active = data.active;
    }

    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }

    // 👇 permitir actualizar type
    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    // 👇 permitir actualizar imageUrl + mantener placeholder si viene vacío
    if (data.imageUrl !== undefined) {
      updateData.imageUrl =
        typeof data.imageUrl === "string" &&
        data.imageUrl.trim() === ""
          ? "/plants/plant-placeholder.png"
          : data.imageUrl;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
