import { Product } from "../../domain/entities/Product";
import { ProductRepository, CreateProductDTO } from "../../domain/repositories/IProductRepository";

export class CreateProduct {
  constructor(private repo: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    return this.repo.create({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock ?? 0,
      createdBy: (data as any).createdBy ?? "unknown",
    });
    }
}
