// orders/src/infrastructure/repositories/order.repository.ts

import {
  Order,
  OrderCustomer,
  OrderStatus,
} from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";

export interface CreateOrderItemInput {
  productId: string;
  productName: string; // 👈 coincide con OrderItem.productName
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderInput {
  cartId: string;
  userId: string;
  userName: string;
  items: CreateOrderItemInput[];
  status?: string; // por ahora usamos "PAID"
}

export interface IOrderRepository {
  create(data: CreateOrderInput): Promise<Order>;
  findAllByUser(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
}

const randomId = () => Math.random().toString(36).slice(2);

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async create(data: CreateOrderInput): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const customer: OrderCustomer = {
      id: data.userId,
      name: data.userName,
      email: undefined,
    };

    // Crear OrderItem de dominio
    const items = data.items.map(
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
      data.cartId,
      customer,
      items,
      total,
      totalItems,
      status,
      new Date(),
    );

    this.orders.push(order);
    return order;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.customer.id === userId);
  }

  async findById(id: string): Promise<Order | null> {
    const found = this.orders.find((o) => o.id === id);
    return found ?? null;
  }
}
