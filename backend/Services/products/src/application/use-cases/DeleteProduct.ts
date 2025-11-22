// src/application/use-cases/DeleteProduct.ts
import { ProductRepository } from "../../domain/repositories/IProductRepository";

export class DeleteProduct {
  constructor(private productRepository: ProductRepository) {}

  /**
   * Devuelve:
   *  - true  -> se eliminó
   *  - false -> no existía
   */
  async execute(id: string): Promise<boolean> {
    const existing = await this.productRepository.findById(id);

    if (!existing) {
      // no lanzamos error, solo indicamos que no se encontró
      return false;
    }

    await this.productRepository.delete(id);
    return true;
  }
}
