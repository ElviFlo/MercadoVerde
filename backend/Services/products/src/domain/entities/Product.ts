// domain/entities/Product.ts

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;

  /**
   * ID de la categoría del producto (nombre nuevo recomendado).
   */
  productCategoryId?: string | null;

  /**
   * Alias legacy para compatibilidad con código antiguo.
   * Idealmente, a futuro dejar solo productCategoryId.
   */
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

  // campo nuevo recomendado
  productCategoryId?: string | null;

  // alias legacy (si alguien llama aún con categoryId)
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

  productCategoryId?: string | null;
  categoryId?: string | null;

  // 👇 opcionales al actualizar
  active?: boolean;
  stock?: number;
}
