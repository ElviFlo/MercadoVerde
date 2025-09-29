import { IOrderRepository } from '../../domain/repositories/order.repository';

import { Order } from "../../domain/entities/order.entity";

export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
