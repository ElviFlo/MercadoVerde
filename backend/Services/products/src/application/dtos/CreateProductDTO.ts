export interface CreateProductDTO {
  name: string;
  description?: string | null;

  // price puede venir como number o string desde el body; el repo lo normaliza
  price: number | string;

  /**
   * ID de la categoría de producto (micro de ProductCategory).
   * Este es el nombre "nuevo" recomendado.
   */
  productCategoryId?: string | null;

  /**
   * Campo legacy / compatibilidad: si algún flujo aún envía `categoryId`,
   * lo mapeamos internamente hacia `productCategoryId`.
   */
  categoryId?: string | null;

  // 👇 quién crea el producto (desde req.user)
  createdBy: string;

  // 👇 campos opcionales al crear
  active?: boolean;   // por defecto true en DB, pero se puede especificar
  stock?: number;     // cantidad inicial disponible
}
