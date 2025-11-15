// src/domain/entities/cart-item.entity.ts

export interface CartItem {
  id: string;
  cartId: string;     // 🔹 ID del carrito (Cart.cartId)
  userId: string;     // string (viene del JWT: sub)
  productId: string;  // string/uuid
  quantity: number;
  price: number;      // precio unitario capturado al momento de agregar
  createdAt: Date;
  updatedAt: Date;
}
