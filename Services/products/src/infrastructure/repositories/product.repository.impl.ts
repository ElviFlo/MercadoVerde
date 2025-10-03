import { Product } from "../../domain/entities/Product";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductRepository as IProductRepository,
} from "../../domain/repositories/IProductRepository";

export class InMemoryProductRepository implements IProductRepository {
  private items: Product[] = [];
  private nextId = 1;

  private toInt(id: number | string) {
    if (typeof id === "number") return id;
    const n = Number(id);
    if (!Number.isInteger(n)) throw new TypeError(`Invalid id "${id}"`);
    return n;
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const now = new Date();
    const p: Product = {
      id: this.nextId++,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock ?? 0,
      createdBy: data.createdBy ?? "unknown",
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(p);
    return p;
  }

  async findAll(): Promise<Product[]> {
    return [...this.items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: number | string): Promise<Product | null> {
    const nid = this.toInt(id);
    return this.items.find(p => p.id === nid) ?? null;
  }

  async update(id: number | string, data: UpdateProductDTO): Promise<Product | null> {
    const nid = this.toInt(id);
    const p = this.items.find(x => x.id === nid);
    if (!p) return null;

    if (data.name !== undefined) p.name = data.name;
    if (data.description !== undefined) p.description = data.description ?? null;
    if (data.price !== undefined) p.price = data.price;
    if (data.stock !== undefined) p.stock = data.stock;
    p.updatedAt = new Date();
    return p;
  }

  async delete(id: number | string): Promise<boolean> {
    const nid = this.toInt(id);
    const before = this.items.length;
    this.items = this.items.filter(p => p.id !== nid);
    return this.items.length < before;
  }

  // opcional para dev/tests
  reset() { this.items = []; this.nextId = 1; }
}

export default InMemoryProductRepository;
