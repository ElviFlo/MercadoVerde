import { Cart } from '../../domain/entities/cart.entity';

export interface ICartRepository {
  getCartByUserId(userId: number): Promise<Cart | null>;
  addItemToCart(userId: number, productId: number, quantity: number, price: number): Promise<any>;
  removeItem(itemId: string): Promise<any>;
}
