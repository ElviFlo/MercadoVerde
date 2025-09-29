// src/application/use-cases/add-to-cart.use-case.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductsClient } from '../../infrastructure/clients/products.client';
import {
  CART_REPO,
  CartRepository,
} from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPO) private readonly repo: CartRepository,
    private readonly products: ProductsClient,
  ) {}

  async execute(input: {
    userId: string;
    productId: string;
    quantity: number;
    authHeader?: string;
  }) {
    // 1) Producto desde el micro de products
    const product = await this.products.getById(
      input.productId,
      input.authHeader,
    );

    // 2) Validaciones
    if (!product) throw new BadRequestException('Product not found');
    if (product.active === false) {
      throw new BadRequestException('Product is inactive');
    }
    const price = Number(product.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw new BadRequestException('Invalid product price');
    }

    // 3) Guardar/Acumular
    await this.repo.addItem(input.userId, input.productId, input.quantity, price);
    return this.repo.getByUser(input.userId);
  }
}
