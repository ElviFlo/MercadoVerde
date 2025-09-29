// Services/orders/src/infrastructure/repositories/order.repository.impl.ts
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

  async findById(id: string): Promise<Order | null> {
    return this.data.get(id) ?? null;
  }

  async update(order: Order): Promise<Order> {
    if (!this.data.has(order.id)) throw new Error("Order not found");
    this.data.set(order.id, order);
    return order;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
}

// 👇 instancia reutilizable
export const orderRepository = new InMemoryOrderRepository();
