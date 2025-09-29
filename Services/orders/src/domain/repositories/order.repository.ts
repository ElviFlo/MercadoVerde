import { Order } from "../entities/order.entity";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;  // 👈 necesario para GET /orders/{id}
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}
