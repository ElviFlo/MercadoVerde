import { Product } from "../entities/Product";

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
  createdBy?: string;
}
export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}
export interface ProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: number | string): Promise<Product | null>;
  update(id: number | string, data: UpdateProductDTO): Promise<Product | null>;
  delete(id: number | string): Promise<boolean>;
}
