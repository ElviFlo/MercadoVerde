export type CartItem = {
  id: string;
  productId: number;
  quantity: number;
  price: number;
};

export type Cart = {
  id: string;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};
