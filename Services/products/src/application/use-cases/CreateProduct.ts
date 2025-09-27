import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { randomUUID } from "crypto";

interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export class CreateProduct{
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const product = new Product(
      id,
      data.name,
      data.description ?? null,
      data.price,
      data.stock ?? 0,
      new Date()
    );
    return this.productRepository.create(product);
  }
}
