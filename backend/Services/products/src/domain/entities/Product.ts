// src/domain/entities/Product.ts

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  type: string;
  imageUrl: string;
  // 👇 campo nuevo
  isActive: boolean;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number | string;
  stock?: number;
  type: string;
  imageUrl?: string;
  // opcional en DTO, pero lo vamos a setear nosotros en el use-case
  isActive?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number | string;
  stock?: number;
  type?: string;
  imageUrl?: string;
  // no lo exposemos aquí: lo calcularemos siempre según stock
  // isActive?: boolean;
}
