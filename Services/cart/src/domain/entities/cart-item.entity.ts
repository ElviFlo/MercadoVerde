export interface CartItem {
  id: string;
  userId: string;       // string (viene del JWT: sub)
  productId: string;    // string/uuid
  quantity: number;
  price: number;        // precio unitario capturado al momento de agregar
  createdAt: Date;
  updatedAt: Date;
}
