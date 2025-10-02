import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_REPO, CartRepository } from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class GetCartUseCase {
  constructor(@Inject(CART_REPO) private readonly repo: CartRepository) {}

  async execute(userId: string) {
    if (!userId) throw new BadRequestException('userId requerido');
    return this.repo.getByUser(userId);
  }
}
