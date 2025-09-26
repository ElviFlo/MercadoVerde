import { Order } from "../entities/order.entity";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
}
