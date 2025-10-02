// Services/orders/src/infrastructure/repositories/order.repository.ts
import { PrismaClient } from "@prisma/client";
import { fetchProduct } from "../services/products.client";

const prisma = new PrismaClient();

type OrderItemInput = { productId: string; quantity: number };

export class OrderRepository {
  async createOrder(
    userId: string,
    items: OrderItemInput[],
    authHeader?: string
  ) {
    // Validar y armar items con nombre y precios desde Products Service
    // (en paralelo para acelerar)
    const enriched = await Promise.all(
      items.map(async (i) => {
        const p = await fetchProduct(i.productId, authHeader);
        if (!p?.id) throw new Error(`Producto ${i.productId} no existe`);
        const nameSnapshot = String(p.name ?? "");
        const unitPrice = Number(p.price ?? 0);
        if (!(unitPrice >= 0)) throw new Error(`Precio inválido para ${i.productId}`);
        const quantity = Number(i.quantity ?? 0);
        if (!(quantity > 0)) throw new Error(`quantity inválido para ${i.productId}`);
        const subtotal = unitPrice * quantity;
        return {
          productId: String(i.productId),
          nameSnapshot,
          unitPrice,
          quantity,
          subtotal,
        };
      })
    );

    const total = enriched.reduce((acc, it) => acc + Number(it.subtotal), 0);

    return prisma.order.create({
      data: {
        userId,                 // string (cuid/uuid)
        status: "PENDING",
        total,                  // Decimal en DB; Prisma acepta number
        items: { create: enriched },
      },
      include: {
        items: true,
      },
    });
  }

  async getById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async getByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  }

  async listAll() {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  }
}
