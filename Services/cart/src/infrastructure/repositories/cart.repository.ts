// src/infrastructure/repositories/cart.repository.ts
import { CartItem } from '../../domain/entities/cart-item.entity';

export interface CartRepository {
  addItem(
    userId: string,
    productId: string,
    quantity: number,
    price: number,
  ): Promise<CartItem>;

  getByUser(userId: string): Promise<CartItem[]>;

  removeItem(userId: string, productId: string): Promise<void>;

  clear(userId: string): Promise<void>;
}

export const CART_REPO = 'CartRepository';
