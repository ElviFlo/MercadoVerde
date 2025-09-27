import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class InMemoryProductRepository implements IProductRepository {
  private products = new Map<string, Product>();

  async create(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async update(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }
}
