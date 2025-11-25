// src/application/use-cases/create-order.use-case.ts
import { IOrderRepository } from "../../infrastructure/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { CartClient } from "../../infrastructure/services/cart.client";

interface CreateOrderDTO {
  cartId: string;
  userName?: string;
}

export class CreateOrder {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly cartService: CartService,
  ) {}

  async execute({ cartId, userName }: CreateOrderDTO): Promise<Order> {
    // 1) Traer el carrito desde el micro de Cart
    const cart = await this.cartClient.getCartById(cartId);

    if (!authHeader) {
      throw new Error("Falta header Authorization");
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart must have at least one item to create an order");
    }

    if (!cart.userId) {
      throw new Error("Cart must have a userId to create an order");
    }

    // 2) Mapear items del carrito al formato que espera el repositorio
    const items = cart.items.map((i: any) => ({
      productId: i.product.id,
      productName: i.product.name,
      unitPrice: i.product.price,
      quantity: i.quantity,
    }));

    // 3) Validar total y totalItems (usamos lo que viene del micro de Cart)
    const total = cart.total;
    const totalItems = cart.totalItems;

    if (!Number.isFinite(total) || total < 0) {
      throw new Error("Cart total must be a non-negative number");
    }

    if (!Number.isInteger(totalItems) || totalItems <= 0) {
      throw new Error("Cart totalItems must be a positive integer");
    }

    // 4) Resolver nombre del usuario (no dependemos de cart.userName)
    const finalUserName = userName ?? "Unknown";

    // 5) Delegar la creación al repositorio (Prisma / InMemory)
    const order = await this.orderRepository.create({
      cartId: cart.id,
      userId: cart.userId,
      userName: finalUserName,
      items,
      status: "PAID",
    });

    return order;
  }
}
