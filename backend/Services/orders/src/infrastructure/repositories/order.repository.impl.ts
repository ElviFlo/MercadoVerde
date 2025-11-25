// orders/src/infrastructure/repositories/order.repository.impl.ts

import {
  IOrderRepository,
  CreateOrderInput,
} from "./order.repository"; // 👈 interfaz + DTOs están en infra
import {
  Order,
  OrderCustomer,
  OrderStatus,
} from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";

const randomId = () => Math.random().toString(36).slice(2);

export class InMemoryOrderRepository implements IOrderRepository {
  private data = new Map<string, Order>();

  async create(input: CreateOrderInput): Promise<Order> {
    if (!input.items || input.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const customer: OrderCustomer = {
      id: input.userId,
      name: input.userName,
      email: undefined,
    };

    // Crear los OrderItem de dominio
    const items = input.items.map(
      (i) =>
        new OrderItem(
          i.productId,
          i.productName,
          i.unitPrice,
          i.quantity,
        ),
    );

    const total = items.reduce((acc, it) => acc + it.subtotal, 0);
    const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);

    const status: OrderStatus = "PAID";

    const order = new Order(
      `order_${randomId()}`,
      input.cartId,
      customer,
      items,
      total,
      totalItems,
      status,
      new Date(),
    );

    this.data.set(order.id, order);
    return order;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return [...this.data.values()].filter((o) => o.customer.id === userId);
  }

  async findById(id: string): Promise<Order | null> {
    return this.data.get(id) ?? null;
  }
}

export const orderRepository = new InMemoryOrderRepository();
