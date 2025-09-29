// src/application/use-cases/remove-from-cart.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(@Inject(CART_REPO) private readonly repo: CartRepository) {}

  async execute(input: { userId: string; productId: string }) {
    await this.repo.removeItem(input.userId, input.productId);
    return this.repo.getByUser(input.userId);
  }
}
