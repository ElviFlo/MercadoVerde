export interface OrderRepository {
  create(order: import('../entities/order.entity').Order): Promise<import('../entities/order.entity').Order>;
  findAll(): Promise<import('../entities/order.entity').Order[]>;
}
