import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_REPO, CartRepository } from '../../infrastructure/repositories/cart.repository';
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

    // Trae producto del microservicio de Products (valida existencia y precio)
    const p = await this.products.getById(productId, authHeader);
    if (!p?.active) throw new BadRequestException('Producto inactivo');

    // El precio unitario es el del momento de agregar
    return this.repo.addItem(userId, productId, quantity, Number(p.price));
  }
}
