import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class DeleteProduct{
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error("Producto no encontrado");
    await this.productRepository.delete(id);
  }
}
