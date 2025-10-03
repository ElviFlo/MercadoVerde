export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  description?: string | null;
  stock?: number;
  createdBy?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}
