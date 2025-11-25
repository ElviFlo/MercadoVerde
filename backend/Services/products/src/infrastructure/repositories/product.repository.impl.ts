// src/infrastructure/repositories/product.repository.impl.ts

import { ProductRepository } from "../../domain/repositories/IProductRepository";
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../../domain/entities/Product";

let randomUUID = () => Math.random().toString(36).slice(2);

export class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async create(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const now = new Date();

    // Normaliza price si viene como string
    const rawPrice =
      typeof data.price === "string"
        ? Number.parseFloat(data.price)
        : data.price;
    const price = Number.isNaN(rawPrice) ? 0 : rawPrice;

    // Normaliza categoría: preferimos productCategoryId, pero aceptamos categoryId
    const productCategoryId =
      data.productCategoryId ?? data.categoryId ?? null;

    // type con default
    const type = data.type ?? "general";

    // imageUrl con placeholder si viene vacío o no viene
    const imageUrl =
      typeof data.imageUrl === "string" && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : "/plants/plant-placeholder.png";

    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price,

      // campos de categoría en el dominio
      productCategoryId,
      categoryId: productCategoryId,

      createdBy: data.createdBy ?? "unknown",
      createdAt: now,
      updatedAt: now,

      active: data.active ?? true,
      stock: data.stock ?? 0,

      type,
      imageUrl,
    };

    this.products.set(product.id, product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;

    // price: admite number o string
    let price = existing.price;
    if (data.price !== undefined) {
      const raw =
        typeof data.price === "string"
          ? Number.parseFloat(data.price)
          : data.price;
      if (!Number.isNaN(raw)) {
        price = raw;
      }
    }

    // categoría normalizada
    const productCategoryId =
      data.productCategoryId ??
      data.categoryId ??
      existing.productCategoryId ??
      existing.categoryId ??
      null;

    // type
    const type = data.type ?? existing.type;

    // imageUrl con placeholder si viene string vacío
    const imageUrl =
      data.imageUrl !== undefined
        ? typeof data.imageUrl === "string" &&
          data.imageUrl.trim() === ""
          ? "/plants/plant-placeholder.png"
          : data.imageUrl
        : existing.imageUrl;

    const updated: Product = {
      ...existing,
      name: data.name ?? existing.name,
      description:
        data.description !== undefined
          ? data.description
          : existing.description,
      price,
      productCategoryId,
      categoryId: productCategoryId,
      active: data.active ?? existing.active,
      stock: data.stock ?? existing.stock,
      type,
      imageUrl,
      updatedAt: new Date(),
    };

    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
