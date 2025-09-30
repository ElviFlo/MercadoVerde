// src/application/use-cases/get-cart.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class GetCartUseCase {
  constructor(@Inject(CART_REPO) private readonly repo: CartRepository) {}

  execute(userId: string) {
    return this.repo.getByUser(userId);
  }
}
