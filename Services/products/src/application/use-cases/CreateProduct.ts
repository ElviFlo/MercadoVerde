import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { CreateProductDTO } from "../dtos/CreateProductDTO";
import { Product } from "../../domain/entities/Product";

export class CreateProduct {
  constructor(private readonly repo: ProductRepository) {}

  async execute(input: CreateProductDTO): Promise<Product> {
    // Normaliza y aplica defaults; el repo devuelve Product completo
    const dto: CreateProductDTO = {
      name: input.name,
      description: input.description ?? null,
      price: typeof input.price === "string" ? parseFloat(input.price) : input.price,
      categoryId: input.categoryId ?? null,
      createdBy: input.createdBy ?? "unknown",
      active: input.active ?? true,
      stock: input.stock ?? 0,
    };

    return this.repo.create(dto);
  }
}
