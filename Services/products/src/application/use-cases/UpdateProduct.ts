import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}

export class UpdateProduct{
  constructor(private productRepository: ProductRepository) {}

  async execute(data: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(data.id);
    if (!existing) throw new Error("Producto no encontrado");
    const updateData = {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      price: data.price ?? existing.price,
      stock: typeof data.stock === 'number' ? data.stock : existing.stock,
    };
    const updated = await this.productRepository.update(data.id, updateData);
    if (!updated) throw new Error("No se pudo actualizar el producto");
    return updated;
  }
}
