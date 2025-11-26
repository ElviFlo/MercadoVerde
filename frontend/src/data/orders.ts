export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

export type OrderStatus = "Paid";

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  mainItem: OrderItem;
  extraCount: number;
};
