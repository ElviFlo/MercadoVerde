import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { CreateProductDTO } from "../../application/dtos/CreateProductDTO";

let randomUUID = () => Math.random().toString(36).slice(2);

export class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async create(data: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const now = new Date();

    // Normaliza price si viene como string
    const price =
      typeof data.price === "string" ? parseFloat(data.price) : data.price;

    // Normaliza categoría: preferimos productCategoryId, pero aceptamos categoryId
    const productCategoryId =
      data.productCategoryId ?? data.categoryId ?? null;

    const product: Product = {
      id,
      name: data.name,
      description: data.description ?? null,
      price,
      // 👇 campo de categoría en el dominio
      productCategoryId,
      createdBy: data.createdBy ?? "unknown",
      createdAt: now,
      updatedAt: now,

      // 👇 nuevos campos añadidos correctamente
      active: data.active ?? true,
      stock: data.stock ?? 0,
    };

    this.products.set(product.id, product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
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
