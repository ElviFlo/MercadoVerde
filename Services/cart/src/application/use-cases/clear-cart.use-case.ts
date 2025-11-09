// Services/cart/src/application/use-cases/clear-cart.use-case.ts
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class ClearCartUseCase {
  constructor(@Inject(CART_REPO) private readonly repo: CartRepository) {}

  async execute(userId: string) {
    if (!userId) throw new BadRequestException('userId requerido');
    await this.repo.clear(userId);
    return { ok: true };
  }
}
