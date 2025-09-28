import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class GetProductById{
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const p = await this.productRepository.findById(id);
    if (!p) throw new Error("Producto no encontrado");
    return p;
  }
}
