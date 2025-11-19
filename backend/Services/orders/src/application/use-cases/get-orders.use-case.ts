// Services/orders/src/application/use-cases/get-orders.use-case.ts
import { IOrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";

export class GetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}
  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
