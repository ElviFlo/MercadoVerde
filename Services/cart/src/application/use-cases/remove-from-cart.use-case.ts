import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_REPO, CartRepository } from '../../infrastructure/repositories/cart.repository';

type RemoveInput = { userId: string; productId: string };

@Injectable()
export class RemoveFromCartUseCase {
  constructor(@Inject(CART_REPO) private readonly repo: CartRepository) {}

  async execute({ userId, productId }: RemoveInput) {
    if (!userId) throw new BadRequestException('userId requerido');
    if (!productId) throw new BadRequestException('productId requerido');
    await this.repo.removeItem(userId, productId);
    return { ok: true };
  }
}
