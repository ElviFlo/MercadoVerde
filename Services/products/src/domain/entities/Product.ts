export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;           // en tu código manejarás number, se convierte a NUMERIC en DB
  createdBy: string;       // user id del JWT
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number;
  createdBy: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
}
