// src/application/use-cases/get-cart.use-case.ts
import { CartRepositoryImpl } from '../../infrastructure/repositories/cart.repository.impl';

export class GetCartUseCase {
  constructor(private repo = new CartRepositoryImpl()) {}

  async execute(userId: number) {
    return this.repo.getCartByUserId(userId);
  }
}
