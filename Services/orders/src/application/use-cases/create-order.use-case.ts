import { OrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";
import { randomUUID } from "crypto";

interface CreateOrderDTO {
  customerId: string;
  items: { productId: string; quantity: number; price: number }[];
}

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(data: CreateOrderDTO): Promise<Order> {
    const items = data.items.map(
      (i) => new OrderItem(i.productId, i.quantity, i.price)
    );
    const order = new Order(randomUUID(), data.customerId, items);
    return this.orderRepository.create(order);
  }
}
