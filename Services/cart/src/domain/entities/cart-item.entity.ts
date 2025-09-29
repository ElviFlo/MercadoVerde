export class CartItem {
  id!: string;         // UUID string
  userId!: string;     // UUID del usuario dueño del carrito
  productId!: string;  // UUID del producto
  quantity!: number;
  price!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // Si en el futuro quieres manejar soft-delete:
  // deletedAt?: Date | null;
}
