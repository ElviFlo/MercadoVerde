import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { CreateProductDTO } from "../dtos/CreateProductDTO";
import { Product } from "../../domain/entities/Product";

export class CreateProduct {
  constructor(private readonly repo: ProductRepository) {}

  async execute(input: CreateProductDTO): Promise<Product> {
    // 1) Normalizar precio
    const numericPrice =
      typeof input.price === "string"
        ? Number.parseFloat(input.price)
        : input.price;

    if (Number.isNaN(numericPrice)) {
      throw new Error("Invalid price value");
    }

    // 2) Normalizar categoría (dual: productCategoryId / categoryId)
    const normalizedCategoryId =
      input.productCategoryId ?? input.categoryId ?? null;

    // 3) Normalizar imageUrl → placeholder si viene vacío o no viene
    let normalizedImageUrl: string | null;
    if (typeof input.imageUrl === "string") {
      normalizedImageUrl =
        input.imageUrl.trim() === ""
          ? "/plants/plant-placeholder.png"
          : input.imageUrl;
    } else {
      normalizedImageUrl = "/plants/plant-placeholder.png";
    }

    // 4) Armar DTO completo para el repo
    const dto: CreateProductDTO = {
      name: input.name,
      description: input.description ?? null,
      price: numericPrice,

      productCategoryId: normalizedCategoryId,
      categoryId: normalizedCategoryId, // compatibilidad

      createdBy: input.createdBy ?? "unknown",
      active: input.active ?? true,
      stock: input.stock ?? 0,

      type: input.type ?? "general",
      imageUrl: normalizedImageUrl,
    };

    return this.repo.create(dto);
  }
}
