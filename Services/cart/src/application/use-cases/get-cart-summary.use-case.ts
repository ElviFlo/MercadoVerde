// Services/cart/src/application/use-cases/get-cart-summary.use-case.ts
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class GetCartSummaryUseCase {
  constructor(
    @Inject(CART_REPO) private readonly repo: CartRepository,
  ) {}

  async execute(userId: string) {
    if (!userId) throw new BadRequestException('userId requerido');
    return this.repo.getSummaryByUser(userId);
  }
}
