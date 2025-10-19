export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;                 // en dominio usamos number; Prisma lo convierte a NUMERIC
  categoryId?: string | null;    // 👈 ahora sí existe este campo
  createdBy: string;             // email o sub del usuario creador
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number;
  categoryId?: string | null;    // 👈 nuevo
  createdBy: string;             // ya estaba, lo mantenemos
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  categoryId?: string | null;    // 👈 opcional también en update
}
