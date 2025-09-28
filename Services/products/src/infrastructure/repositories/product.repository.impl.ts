import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class InMemoryProductRepository extends ProductRepository {
  private products = new Map<string, Product>();


  async create(data: any): Promise<Product> {
    // Accepts CreateProductDTO or Product
    const id = data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2));
    const now = new Date();
    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(product.id, product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }


  async update(id: string, data: any): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
