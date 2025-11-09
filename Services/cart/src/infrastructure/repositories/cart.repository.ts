// Services/cart/src/infrastructure/repositories/cart.repository.ts
import { CartItem } from '../../domain/entities/cart-item.entity';

export const CART_REPO = 'CART_REPO';

// Resumen de carrito usado por la API
export type CartSummary = {
  items: CartItem[];
  count: number;    // total de items (sum quantities)
  subtotal: number; // total en dinero
};

export interface CartRepository {
  // Usado por GetCartSummaryUseCase
  getSummaryByUser(userId: string): Promise<CartSummary>;

  // Usado por AddToCartUseCase
  addItem(
    userId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
  ): Promise<CartItem>;

  // Usado por RemoveFromCartUseCase
  removeItem(userId: string, productId: string): Promise<void>;

  // Usado por ClearCartUseCase
  clear(userId: string): Promise<void>;
}
