// src/application/use-cases/create-order.use-case.ts
import { OrderRepository } from "../../infrastructure/repositories/order.repository";
import { CartService } from "../../infrastructure/services/cart.client";

export interface CreateOrderInput {
  cartId: string;
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

    const cart = await this.cartService.getMyCart(authHeader);

    if (!cart) throw new Error("Carrito no encontrado");
    if (!cart.items || cart.items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const items = cart.items.map((it) => ({
      productId: it.productId,
      nameSnapshot: it.nameSnapshot,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      subtotal: it.subtotal,
    }));

    const created = await this.orderRepo.createOrder(
      cartId,
      userId,
      userName,
      userEmail,
      items,
    );

    return created;
  }
}
