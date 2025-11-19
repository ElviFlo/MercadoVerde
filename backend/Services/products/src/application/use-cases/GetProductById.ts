import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class GetProductById {
  constructor(private readonly repo: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    // No hagas mapeos parciales: devuelve el Product completo del repo
    return this.repo.findById(id);
  }
}
