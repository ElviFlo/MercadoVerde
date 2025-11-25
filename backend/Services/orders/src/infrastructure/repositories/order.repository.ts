// services/orders/src/infrastructure/repositories/order.repository.ts
import { PrismaClient } from "@prisma/client";
import { fetchProduct, reserveProduct, releaseProduct } from "../services/products.client";

const prisma = new PrismaClient() as any; // 👈 hack: evitamos el error de TS con .order

type OrderItemInput = { productId: string; quantity: number };

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

    if (!cart || cart.userId !== userId) {
      throw new Error(`Cart ${cartId} not found for user ${userId}`);
    }

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
    );

    const total = enriched.reduce((acc, it) => acc + Number(it.subtotal), 0);
    const totalItems = enriched.reduce(
      (acc, it) => acc + Number(it.quantity),
      0
    );

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
