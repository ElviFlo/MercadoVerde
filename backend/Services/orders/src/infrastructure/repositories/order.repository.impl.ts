import { IOrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";

export class InMemoryOrderRepository implements IOrderRepository {
  private data = new Map<string, Order>();

  async create(order: Order): Promise<Order> {
    this.data.set(order.id, order);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return [...this.data.values()];
  }

}

export const orderRepository = new InMemoryOrderRepository();
