// src/domain/repositories/IProductRepository.ts

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from "../entities/Product";

export interface ProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: UpdateProductDTO): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
