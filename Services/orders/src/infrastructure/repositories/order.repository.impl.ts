import { OrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async create(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orders;
  }
}
