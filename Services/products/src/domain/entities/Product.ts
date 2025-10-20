export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  // 👇 NUEVOS CAMPOS
  active: boolean;   // indica si está disponible para comprar
  stock: number;     // cantidad disponible
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number | string;
  categoryId?: string | null;
  createdBy: string;

  // 👇 opcionales al crear
  active?: boolean;
  stock?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  categoryId?: string | null;

  // 👇 opcionales al actualizar
  active?: boolean;
  stock?: number;
}
