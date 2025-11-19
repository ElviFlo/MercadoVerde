import { CreateProductDTO, Product, UpdateProductDTO } from "../entities/Product";

// Repository interface for products. Implementations live under infrastructure/repositories
export interface ProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: UpdateProductDTO): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
