// src/application/use-cases/create-order.use-case.ts
import { OrderRepository } from "../../infrastructure/repositories/order.repository";
import { CartService } from "../../infrastructure/services/cart.client";

export interface CreateOrderInput {
  cartId?: string;   // 👈 opcional, si viene del body lo usamos
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
    const { cartId, userId, userName, userEmail, authHeader } = input;

    if (!authHeader) {
      throw new Error("Falta header Authorization");
    }

    // 👇 Llamamos al microservicio de cart
    const cart = await this.cartService.getMyCart(authHeader);

    console.log("[CreateOrder] userId del token:", userId);
    console.log("[CreateOrder] cart.id:", cart?.id);
    console.log("[CreateOrder] cart.userId:", cart?.userId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (cart.userId !== userId) {
      throw new Error("Carrito no encontrado para este usuario");
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // Usamos el cartId del body si viene, si no, el del carrito
    const finalCartId = cartId ?? cart.id;

    // Mapear items del carrito a items de la orden
    const items = cart.items.map((it) => ({
      productId: it.productId,
      nameSnapshot: it.nameSnapshot,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      subtotal: it.subtotal,
    }));

    const order = await this.orderRepo.createOrder(
      finalCartId,
      userId,
      userName,
      userEmail,
      items,
    );

    return order;
  }
}
