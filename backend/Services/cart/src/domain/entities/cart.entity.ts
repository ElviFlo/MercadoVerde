// src/domain/entities/cart.entity.ts

export type CartItem = {
  id: string;
  cartId: string;   // 🔹 identificador del carrito al que pertenece
  productId: number;
  quantity: number;
  price: number;
};

export type Cart = {
  id: string;
  cartId: string;   // 🔹 ID público del carrito (el que conoce otros microservicios / el front)
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};
