import { Inject, Injectable } from '@nestjs/common';
import { CartRepository } from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(@Inject('CartRepository') private readonly repo: CartRepository) {}

  execute(input: { userId: string; productId: string }): Promise<void> {
    return this.repo.removeItem(input.userId, input.productId);
  }
}
