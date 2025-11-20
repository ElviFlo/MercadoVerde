export type ProductType = "indoor" | "outdoor" | "succulent" | "cacti" | "aromatic" | "flowering";

export type Product = {
  id: number;
  name: string;
  price: number;
  type: ProductType;
  imageUrl: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Fiddle Leaf Fig",
    price: 120,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 2,
    name: "Rubber Plant",
    price: 80,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 3,
    name: "Areca Palm",
    price: 150,
    type: "outdoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 4,
    name: "Mini Ficus",
    price: 95,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 5,
    name: "Peace Lily",
    price: 60,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 6,
    name: "Snake Plant",
    price: 70,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 7,
    name: "Outdoor Boxwood",
    price: 180,
    type: "outdoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 8,
    name: "Succulent Mix",
    price: 40,
    type: "succulent",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 9,
    name: "Hanging Ivy",
    price: 55,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 10,
    name: "Cactus Trio",
    price: 35,
    type: "succulent",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 11,
    name: "Outdoor Fern",
    price: 90,
    type: "outdoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 12,
    name: "ZZ Plant",
    price: 110,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 13,
    name: "Outdoor Fern",
    price: 90,
    type: "outdoor",
    imageUrl: "/plants/plant.png",
  },
  {
    id: 14,
    name: "ZZ Plant",
    price: 110,
    type: "indoor",
    imageUrl: "/plants/plant.png",
  },
];
