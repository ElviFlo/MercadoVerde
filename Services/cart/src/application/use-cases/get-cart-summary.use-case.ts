// src/application/use-cases/get-cart-summary.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { CART_REPO, CartRepository } from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class GetCartSummaryUseCase {
  constructor(
    @Inject(CART_REPO) private readonly repo: CartRepository,
  ) {}

  /**
   * Devuelve { items, count, subtotal } para el usuario.
   */
  async execute(userId: string) {
    const items = await this.repo.getByUser(userId);
    const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    return {
      items,
      count: items.length,
      subtotal,
    };
    // Si luego quieres impuestos/envío/descuentos: calcúlalos aquí.
  }
}
