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

  // 👇 tipo de producto (por ejemplo: "plant", "tool", "soil", etc.)
  type: string;

  // URL de la imagen del producto (puede ser null si se usa placeholder)
  imageUrl: string | null;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;

  // price puede venir como number o string; se normaliza en la capa de aplicación/repositorio
  price: number | string;

  // campo nuevo recomendado
  productCategoryId?: string | null;

  // alias legacy (si alguien llama aún con categoryId)
  categoryId?: string | null;

  createdBy: string;

  // 👇 opcionales al crear
  active?: boolean;
  stock?: number;

  // tipo de producto (requerido conceptualmente al crear)
  type: string;

  // URL de la imagen; si no se envía o viene vacío, se usará el placeholder
  imageUrl?: string | null;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;

  // price también puede venir como number o string
  price?: number | string;

  productCategoryId?: string | null;
  categoryId?: string | null;

  // 👇 opcionales al actualizar
  active?: boolean;
  stock?: number;

  // permitir cambiar el tipo del producto
  type?: string;

  // permitir cambiar la imagen; si viene string vacío, se normaliza a placeholder
  imageUrl?: string | null;
}
