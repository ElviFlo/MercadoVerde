import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { randomUUID } from "crypto";

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId?: string | null;
  createdBy: string; // 👈 nuevo campo obligatorio aquí
}

export class CreateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const now = new Date();

    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      categoryId: data.categoryId ?? null,   // 👈 ahora lo admite
      createdBy: data.createdBy || "unknown", // 👈 viene tipado, sin `as any`
      createdAt: now,
      updatedAt: now,
    };

    return this.productRepository.create(product);
  }
}
