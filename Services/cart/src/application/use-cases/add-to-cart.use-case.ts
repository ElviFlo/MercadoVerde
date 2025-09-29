import { Inject, Injectable } from '@nestjs/common';
import { CartRepository } from '../../infrastructure/repositories/cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject('CartRepository') private readonly repo: CartRepository,
  ) {}

  execute(input: {
    userId: string;
    productId: string;   // UUID string
    quantity: number;
    price: number;
  }): Promise<CartItem> {
    const { userId, productId, quantity, price } = input;
    return this.repo.addItem(userId, productId, quantity, price);
  }
}
