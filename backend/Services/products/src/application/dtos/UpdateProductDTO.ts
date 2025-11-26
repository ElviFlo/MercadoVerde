// src/application/dtos/UpdateProductDTO.ts
import type { CreateProductDTO } from "./CreateProductDTO";

// Para update todos los campos son opcionales.
export type UpdateProductDTO = Partial<CreateProductDTO>;
