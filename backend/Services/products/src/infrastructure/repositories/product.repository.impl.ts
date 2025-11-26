// src/infrastructure/repositories/product.repository.impl.ts

import { ProductRepository } from "../../domain/repositories/IProductRepository";
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../../domain/entities/Product";

const randomUUID = () => Math.random().toString(36).slice(2);

export class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async create(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();

    // precio normalizado
    const rawPrice =
      typeof data.price === "string"
        ? Number.parseFloat(data.price)
        : data.price;
    const price = Number.isFinite(rawPrice) ? rawPrice : 0;

    // imageUrl con placeholder SIEMPRE string
    const imageUrl: string =
      typeof data.imageUrl === "string" && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : "/plants/plant-placeholder.png";

    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price,
      stock: data.stock ?? 0,
      type: data.type ?? "indoor",
      imageUrl, // 👈 string
    };

    this.products.set(id, product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;

    // precio
    let price = existing.price;
    if (data.price !== undefined) {
      const raw =
        typeof data.price === "string"
          ? Number.parseFloat(data.price)
          : data.price;
      if (Number.isFinite(raw)) price = raw;
    }

    // imageUrl SIEMPRE string
    let imageUrl: string = existing.imageUrl;
    if (data.imageUrl !== undefined) {
      if (data.imageUrl.trim() === "") {
        imageUrl = "/plants/plant-placeholder.png";
      } else {
        imageUrl = data.imageUrl;
      }
    }

    const updated: Product = {
      ...existing,
      name: data.name ?? existing.name,
      description:
        data.description !== undefined
          ? data.description
          : existing.description,
      price,
      stock: data.stock ?? existing.stock,
      type: data.type ?? existing.type,
      imageUrl, // 👈 string
    };

    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
