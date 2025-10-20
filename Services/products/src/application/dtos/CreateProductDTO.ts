export interface CreateProductDTO {
  name: string;
  description?: string | null;

  // price puede venir como number o string desde el body; el repo lo normaliza
  price: number | string;

  categoryId?: string | null;

  // 👇 nuevo: quién crea el producto (desde req.user)
  createdBy: string;

  // 👇 nuevos campos (opcionales al crear)
  active?: boolean;   // por defecto true en DB, pero se puede especificar
  stock?: number;     // cantidad inicial disponible
}
