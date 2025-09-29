import { CartItem } from '../../domain/entities/cart-item.entity';

export interface CartRepository {
  addItem(userId: string, productId: string, quantity: number, price: number): Promise<CartItem>;
  getItems(userId: string): Promise<CartItem[]>;
  removeItem(userId: string, productId: string): Promise<void>;
  clear(userId: string): Promise<void>;
}
