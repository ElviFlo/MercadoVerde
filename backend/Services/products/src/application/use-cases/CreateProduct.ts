import { ProductRepository } from "../../domain/repositories/IProductRepository";
import type { Product, CreateProductDTO } from "../../domain/entities/Product";

export class CreateProduct {
  constructor(private readonly repo: ProductRepository) {}

  async execute(input: CreateProductDTO): Promise<Product> {
    // 1) Normalizar precio
    const numericPrice =
      typeof input.price === "string"
        ? Number.parseFloat(input.price)
        : input.price;

    if (!Number.isFinite(numericPrice)) {
      throw new Error("Invalid price value");
    }

    // 2) Normalizar imageUrl → placeholder si viene vacío o no viene
    const normalizedImageUrl =
      typeof input.imageUrl === "string" && input.imageUrl.trim() !== ""
        ? input.imageUrl
        : "/plants/plant-placeholder.png";

    // 3) DTO final que mandamos al repositorio
    const dto: CreateProductDTO = {
      name: input.name,
      description: input.description ?? null,
      price: numericPrice,
      stock: input.stock ?? 0,
      type: input.type ?? "indoor",
      imageUrl: normalizedImageUrl,
    };

    return this.repo.create(dto);
  }
}
