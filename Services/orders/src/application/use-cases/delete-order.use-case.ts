import { IOrderRepository } from "../../domain/repositories/order.repository";

export class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw { status: 404, message: "Order not found" };
    }

    await this.orderRepository.delete(id);
  }
}
