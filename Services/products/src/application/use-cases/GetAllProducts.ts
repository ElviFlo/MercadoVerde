import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class GetAllProducts {
  constructor(private readonly repo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    // Igual: sin select manual que omita active/stock
    return this.repo.findAll();
  }
}
