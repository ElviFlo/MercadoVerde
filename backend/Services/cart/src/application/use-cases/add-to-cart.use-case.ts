// Services/cart/src/application/use-cases/add-to-cart.use-case.ts
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';
import { ProductsClient } from '../../infrastructure/clients/products.client';

type AddInput = {
  userId: string;
  productId: string;
  quantity: number;
  authHeader?: string;
};

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPO) private readonly repo: CartRepository,
    private readonly products: ProductsClient,
  ) {}

  async execute(input: AddInput) {
    const { userId, productId, quantity, authHeader } = input;

    if (!userId) throw new BadRequestException('userId requerido');
    if (!productId) throw new BadRequestException('productId requerido');
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity debe ser entero positivo');
    }

    const p: any = await this.products.getById(productId, authHeader);

    if (!p) {
      throw new BadRequestException('Producto no encontrado');
    }

    // stock normalizado
    const stock =
      typeof p.stock === 'number' && Number.isInteger(p.stock) ? p.stock : 0;

    // compatibilidad: algunos servicios pueden exponer `active` y otros `isActive`
    const explicitActive =
      typeof p.isActive === 'boolean'
        ? p.isActive
        : typeof p.active === 'boolean'
        ? p.active
        : true; // por defecto lo consideramos activo si no viene flag

    // Regla de negocio:
    // - Debe tener stock > 0
    // - Y no estar bloqueado manualmente (explicitActive = true)
    if (stock <= 0) {
      throw new BadRequestException('Producto sin stock');
    }

    if (!explicitActive) {
      throw new BadRequestException('Producto inactivo');
    }

    // devuelve el resumen actualizado o el valor que implemente el repo
    return this.repo.addItem(userId, productId, quantity, Number(p.price));
  }
}
