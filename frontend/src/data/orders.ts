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

export const ORDERS: Order[] = [
  {
    id: "24OB10UGJYXXM1",
    date: "Nov 15, 2025",
    status: "Paid",
    total: 319.98,
    mainItem: {
      name: "Snake Plant",
      quantity: 1,
      price: 149.99,
      imageUrl: "/plants/plant.png",
    },
    extraCount: 1,
  },
  {
    id: "24OB10UGJYXXM2",
    date: "Nov 15, 2025",
    status: "Paid",
    total: 319.98,
    mainItem: {
      name: "Snake Plant",
      quantity: 1,
      price: 149.99,
      imageUrl: "/plants/plant.png",
    },
    extraCount: 1,
  },
  {
    id: "24OB10UGJYXXM3",
    date: "Nov 15, 2025",
    status: "Paid",
    total: 319.98,
    mainItem: {
      name: "Snake Plant",
      quantity: 1,
      price: 149.99,
      imageUrl: "/plants/plant.png",
    },
    extraCount: 1,
  },
];
