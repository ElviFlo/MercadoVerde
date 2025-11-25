// src/application/use-cases/get-orders.use-case.ts
import { IOrderRepository } from "../../infrastructure/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";

export class GetAllOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findAllByUser(userId);
  }
}
