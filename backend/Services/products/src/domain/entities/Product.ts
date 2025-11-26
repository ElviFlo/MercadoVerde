// src/domain/entities/Product.ts

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  type: string;
  imageUrl: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number | string;
  stock?: number;
  type: string;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number | string;
  stock?: number;
  type?: string;
  imageUrl?: string;
}
