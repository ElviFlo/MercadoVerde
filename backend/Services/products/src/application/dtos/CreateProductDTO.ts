// src/application/dtos/CreateProductDTO.ts

import type { CreateProductDTO as DomainCreateProductDTO } from "../../domain/entities/Product";

/**
 * Alias de DTO de creación de producto usado en la capa de aplicación.
 * Reutiliza la definición del dominio para no duplicar tipos.
 */
export type CreateProductDTO = DomainCreateProductDTO;
