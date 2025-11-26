// use-cases/updateProduct.ts
import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { UpdateProductDTO } from "../dtos/UpdateProductDTO";

interface UpdateProductInput extends UpdateProductDTO {
  id: string;
}

export class UpdateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: UpdateProductInput): Promise<Product> {
    const existing = await this.productRepository.findById(data.id);
    if (!existing) {
      throw new Error("Producto no encontrado");
    }

    const patch: UpdateProductDTO & { isActive?: boolean } = {};

    // name
    if (data.name !== undefined) {
      patch.name = data.name;
    }

    // description
    if (data.description !== undefined) {
      patch.description = data.description;
    }

    // price (normalizando string → number)
    if (data.price !== undefined) {
      const numericPrice =
        typeof data.price === "string"
          ? Number.parseFloat(data.price)
          : data.price;

      if (Number.isNaN(numericPrice)) {
        throw new Error("Invalid price value");
      }

      patch.price = numericPrice;
    }

    // stock (y guardamos en una variable el stock resultante)
    let finalStock = existing.stock;
    if (data.stock !== undefined) {
      if (!Number.isInteger(data.stock) || data.stock < 0) {
        throw new Error("Stock must be a non-negative integer");
      }
      finalStock = data.stock;
      patch.stock = data.stock;
    }

    // type
    if (data.type !== undefined) {
      const t = data.type.trim();
      patch.type = t === "" ? existing.type : t;
    }

    // imageUrl (mantener placeholder si se manda vacío)
    if (data.imageUrl !== undefined) {
      const img = (data.imageUrl ?? "").trim();
      patch.imageUrl =
        img === "" ? "/plants/plant-placeholder.png" : img;
    }

    // ⚙️ Reglas de activación:
    // Siempre que actualicemos (o aunque no cambie el stock),
    // consideramos activo si el stock resultante es > 0
    patch.isActive = finalStock > 0;

    const updated = await this.productRepository.update(data.id, patch);
    if (!updated) {
      throw new Error("No se pudo actualizar el producto");
    }
    return updated;
  }
}
