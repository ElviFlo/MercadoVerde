import { Inject, Injectable } from '@nestjs/common';
import { CartRepository } from '../../infrastructure/repositories/cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject('CartRepository') private readonly repo: CartRepository,
  ) {}

  execute(userId: string): Promise<CartItem[]> {
    return this.repo.getItems(userId);
  }
}
