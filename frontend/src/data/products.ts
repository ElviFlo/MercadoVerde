export type ProductType =
  | "indoor"
  | "outdoor"
  | "succulent"
  | "cacti"
  | "aromatic"
  | "flowering";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  type: ProductType;
  imageUrl: string;
}
