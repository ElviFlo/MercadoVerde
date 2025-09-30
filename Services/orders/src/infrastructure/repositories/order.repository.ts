import { PrismaClient } from "@prisma/client"; // 👈 quita OrderStatus
const prisma = new PrismaClient();

export class OrderRepository {
  async createFromItems(
    userId: number,
    items: { productId: number; quantity: number }[],
  ) {
    const ids = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    });

    const priceById = new Map(products.map((p) => [p.id, Number(p.price)]));

    const orderItems = items.map((i) => {
      const unitPrice = priceById.get(i.productId);
      if (unitPrice == null)
        throw new Error(`Producto ${i.productId} no existe`);
      if (i.quantity <= 0)
        throw new Error(`Cantidad inválida para producto ${i.productId}`);
      return { productId: i.productId, quantity: i.quantity, price: unitPrice };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING", // 👈 string
        items: { create: orderItems },
      },
      include: { items: true },
    });

    return order;
  }

  async getById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async listAll() {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async listByUser(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  }
}
