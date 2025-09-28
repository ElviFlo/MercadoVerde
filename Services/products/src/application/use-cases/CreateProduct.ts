import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { randomUUID } from "crypto";

interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export class CreateProduct{
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      createdBy: (data as any).createdBy ?? "unknown",
      createdAt: now,
      updatedAt: now,
    };
    return this.productRepository.create(product);
  }
}
