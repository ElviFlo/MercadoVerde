import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export class UpdateProduct{
  constructor(private productRepository: IProductRepository) {}

  async execute(data: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(data.id);
    if (!existing) throw new Error("Producto no encontrado");

    existing.name = data.name ?? existing.name;
    existing.description = data.description ?? existing.description;
    existing.price = data.price ?? existing.price;
    existing.stock = data.stock ?? existing.stock;
    existing.updatedAt = new Date();

    return this.productRepository.update(existing);
  }
}
