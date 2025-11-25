// src/application/use-cases/create-order.use-case.ts
import { OrderRepository } from "../../infrastructure/repositories/order.repository";
import { CartService } from "../../infrastructure/services/cart.client";

export interface CreateOrderInput {
  userId: string;
  userName: string;
  userEmail?: string;
  authHeader: string;
}

export class CreateOrder {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly cartService: CartService,
  ) {}

  async execute(input: CreateOrderInput) {
    const { userId, userName, userEmail, authHeader } = input;

    if (!authHeader) {
      throw new Error("Falta header Authorization");
    }

    // 👇 Llamamos al microservicio de cart
    const cart = await this.cartService.getMyCart(authHeader);

    console.log("[CreateOrder] userId del token:", userId);
    console.log("[CreateOrder] cart.userId:", cart?.userId);

    if (!cart || cart.userId !== userId) {
      throw new Error("Carrito no encontrado para este usuario");
    }

    // Mapear items del carrito a items de la orden
    const items = cart.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
    }));

    const created = await this.orderRepo.createOrder(
      cart.id,      // 👈 aquí usamos EL cartId del carrito
      userId,
      userName,
      userEmail,
      items,
      authHeader,
    );

    return order;
  }
}
