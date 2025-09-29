import { IOrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";

export class GetOrderByIdUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
