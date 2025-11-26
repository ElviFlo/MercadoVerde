import { prisma } from "../../prisma/client";

type OrderItemCreateInput = {
  productId: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export class OrderRepository {
  async createOrder(
    cartId: string,
    userId: string,
    userName: string,
    userEmail: string | undefined,
    items: OrderItemCreateInput[],
  ) {
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const total = items.reduce((sum, it) => sum + it.subtotal, 0);

    return prisma.order.create({
      data: {
        cartId,
        userId,
        userName,
        // 👇 AHORA SÍ enviamos el total a la columna Decimal
        total,
        totalItems,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            nameSnapshot: it.nameSnapshot,
            unitPrice: it.unitPrice,
            quantity: it.quantity,
            subtotal: it.subtotal,
          })),
        },
      },
      include: { items: true },
    });
  }

  async getByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async listAll() {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
