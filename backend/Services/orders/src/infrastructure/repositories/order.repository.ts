<<<<<<< HEAD
// orders/src/infrastructure/repositories/order.repository.ts

import {
  Order,
  OrderCustomer,
  OrderStatus,
} from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";
=======
// services/orders/src/infrastructure/repositories/order.repository.ts
import { PrismaClient } from "@prisma/client";
import { fetchProduct, reserveProduct, releaseProduct } from "../services/products.client";

const prisma = new PrismaClient() as any; // 👈 hack: evitamos el error de TS con .order
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e

export interface CreateOrderItemInput {
  productId: string;
  productName: string; // 👈 coincide con OrderItem.productName
  unitPrice: number;
  quantity: number;
}

<<<<<<< HEAD
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
=======
export class OrderRepository {
  async createOrder(
    cartId: string,
    userId: string,
    userName: string,
    userEmail: string | undefined,
    items: OrderItemInput[],
    authHeader?: string
  ) {
    // (Si ya no usas cart en la DB, puedes quitar esta validación o adaptarla al nuevo diseño)
    // Por ahora la dejo igual que tenías:
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e

const randomId = () => Math.random().toString(36).slice(2);

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async create(data: CreateOrderInput): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

<<<<<<< HEAD
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
=======
    const enriched = await Promise.all(
      items.map(async (i) => {
        const p = await fetchProduct(i.productId, authHeader);
        if (!p?.id) throw new Error(`Producto ${i.productId} no existe`);

        const nameSnapshot = String(p.name ?? "");
        const unitPrice = Number(p.price ?? 0);
        if (!(unitPrice >= 0)) {
          throw new Error(`Precio inválido para ${i.productId}`);
        }

        const quantity = Number(i.quantity ?? 0);
        if (!(quantity > 0)) {
          throw new Error(`quantity inválido para ${i.productId}`);
        }

        const subtotal = unitPrice * quantity;

        return {
          productId: String(i.productId),
          nameSnapshot,
          unitPrice,
          quantity,
          subtotal,
        };
      })

    this.orders.push(order);
    return order;

    const reserved: Array<{ productId: string; quantity: number }> = [];

    try {
      // 1) Reservar stock en products
      for (const it of enriched) {
        await reserveProduct(it.productId, it.quantity);
        reserved.push({ productId: it.productId, quantity: it.quantity });
      }

      // 2) Crear la orden y sus items
      const created = await prisma.order.create({
        data: {
          cartId: cart.id,
          userId,
          userName,
          status: "PAID",
          total,
          totalItems,
          items: {
            create: enriched,
          },
        },
        include: { items: true },
      });

      return created;
    } catch (e) {
      // Si algo falla, liberamos las reservas de stock (best-effort)
      for (const r of reserved) {
        try {
          await releaseProduct(r.productId, r.quantity);
        } catch {
          // ignorar errores aquí
        }
      }
      throw e;
    }
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.customer.id === userId);
  }

  async findById(id: string): Promise<Order | null> {
    const found = this.orders.find((o) => o.id === id);
    return found ?? null;
  }
}
