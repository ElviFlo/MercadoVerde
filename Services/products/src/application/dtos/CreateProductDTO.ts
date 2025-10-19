// Services/products/src/application/dtos/CreateProductDTO.ts
export interface CreateProductDTO {
  name: string;
  description?: string | null;
  // price puede venir como number o string desde el body; el repo lo normaliza
  price: number | string;
  categoryId?: string | null;

  // 👇 nuevo: quién crea el producto (desde req.user)
  createdBy: string;
}
