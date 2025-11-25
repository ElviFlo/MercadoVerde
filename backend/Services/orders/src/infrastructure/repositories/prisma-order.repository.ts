// src/infrastructure/repositories/prisma-order.repository.ts
import {
  PrismaClient,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from "@prisma/client";

import {
  IOrderRepository,
  CreateOrderInput,
} from "../../infrastructure/repositories/order.repository";

import {
  Order,
  OrderCustomer,
  OrderStatus,
} from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";

const globalForPrisma = globalThis as unknown as { prismaOrders?: PrismaClient };
const prisma = globalForPrisma.prismaOrders ?? new PrismaClient();
if (!globalForPrisma.prismaOrders) globalForPrisma.prismaOrders = prisma;

function decimalToNumber(value: any): number {
  if (value && typeof value === "object" && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return Number(value ?? 0);
}

function mapStatusFromDb(raw: string): OrderStatus {
  // En DB default = "Paid", en dominio usamos 'PAID'
  const normalized = raw.toUpperCase();
  if (normalized === "PAID") return "PAID";
  return "PAID"; // fallback
}

function mapStatusToDb(status?: string): string {
  // Dominio usa 'PAID', en schema default = "Paid"
  if (!status) return "Paid";
  if (status.toUpperCase() === "PAID") return "Paid";
  return status;
}

function mapOrderItemsToDomain(prismaItems: PrismaOrderItem[]): OrderItem[] {
  return prismaItems.map(
    (item) =>
      new OrderItem(
        item.productId,
        item.nameSnapshot,                         // 👈 mapeamos nameSnapshot -> productName
        decimalToNumber(item.unitPrice),
        item.quantity,
      ),
  );
}

function mapOrderToDomain(
  order: PrismaOrder & { items: PrismaOrderItem[] },
): Order {
  const customer: OrderCustomer = {
    id: order.userId,
    name: order.userName,
    email: undefined, // si luego guardas email en DB, se mapea aquí
  };

  const items = mapOrderItemsToDomain(order.items);
  const total = decimalToNumber(order.total);
  const status = mapStatusFromDb(order.status);

  return new Order(
    order.id,
    order.cartId,
    customer,
    items,
    total,
    order.totalItems,
    status,
    order.createdAt,
  );
}

export class PrismaOrderRepository implements IOrderRepository {
  async create(data: CreateOrderInput): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    // totalItems = suma de cantidades
    const totalItems = data.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    // total = Σ (unitPrice * quantity)
    const total = data.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    const statusDb = mapStatusToDb(data.status ?? "PAID");

    const created = await prisma.order.create({
      data: {
        cartId: data.cartId,
        userId: data.userId,
        userName: data.userName,
        status: statusDb,
        total,
        totalItems,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            nameSnapshot: item.productName,                   // 👈 aquí usamos productName
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return mapOrderToDomain(created);
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    const rows = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(mapOrderToDomain);
  }

  async findById(id: string): Promise<Order | null> {
    const row = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!row) return null;
    return mapOrderToDomain(row);
  }
}
