import { Product } from '../entities/Product';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

