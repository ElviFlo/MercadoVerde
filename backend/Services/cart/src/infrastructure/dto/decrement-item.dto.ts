// src/application/use-cases/decrement-item.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

export interface DecrementItemInput {
  userId: string;
  productId: string;
}

@Injectable()
export class DecrementItemUseCase {
  constructor(
    @Inject(CART_REPO)
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(input: DecrementItemInput): Promise<void> {
    const { userId, productId } = input;
    await this.cartRepository.decrementItem(userId, productId);
  }
}
