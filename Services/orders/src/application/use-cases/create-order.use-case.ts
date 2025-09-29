import { IOrderRepository } from '../../domain/repositories/order.repository';
import { Order } from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";
import { randomUUID } from "crypto";

interface CreateOrderDTO {
  customer: { name: string; email: string };
  items: { productId: string; quantity: number; price: number }[];
}

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(data: CreateOrderDTO): Promise<Order> {
    const items = data.items.map(
      (i) => new OrderItem(i.productId, i.quantity, i.price)
    );
    const order = new Order(randomUUID(), data.customer, items);
    return this.orderRepository.create(order);
  }
}
