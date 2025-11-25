import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string | null;
  // price puede venir como number o string (igual que en Create)
  price?: number | string;
  stock?: number;

  // categoría (nuevo + legacy)
  productCategoryId?: string | null;
  categoryId?: string | null;

  // otros flags
  active?: boolean;

  // nuevos campos
  type?: string;
  imageUrl?: string | null;
}

export class UpdateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(data.id);
    if (!existing) throw new Error("Producto no encontrado");

    const updateData: any = {
      // si no viene en el body, mantenemos el valor actual
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,

      // price: dejamos que el repo normalice (number/string → number)
      price: data.price ?? existing.price,

      stock:
        typeof data.stock === "number" ? data.stock : existing.stock,

      // normalizamos categoría en dual productCategoryId / categoryId
      productCategoryId:
        data.productCategoryId ??
        data.categoryId ??
        existing.productCategoryId ??
        existing.categoryId ??
        null,
      categoryId:
        data.categoryId ??
        data.productCategoryId ??
        existing.categoryId ??
        existing.productCategoryId ??
        null,

      active: data.active ?? existing.active,

      // nuevos campos
      type: data.type ?? existing.type,
      imageUrl:
        data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
    };

    const updated = await this.productRepository.update(
      data.id,
      updateData,
    );
    if (!updated) throw new Error("No se pudo actualizar el producto");
    return updated;
  }
}
