import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductsClient } from '../../infrastructure/clients/products.client';
import { CART_REPO, CartRepository } from '../../infrastructure/repositories/cart.repository';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPO) private readonly repo: CartRepository,
    private readonly products: ProductsClient,
  ) {}

  async execute(input: {
    userId: string;
    productId: string | number;
    quantity: number;
    authHeader?: string;
  }) {
    const normalizedId = typeof input.productId === 'number' ? String(input.productId) : input.productId;

    const product = await this.products.getById(normalizedId, input.authHeader);
    if (!product) throw new BadRequestException('Product not found');
    if (product.active === false) throw new BadRequestException('Product is inactive');

    const price = Number(product.price);
    if (!Number.isFinite(price) || price <= 0) throw new BadRequestException('Invalid product price');

    await this.repo.addItem(input.userId, normalizedId, input.quantity, price);
    return this.repo.getByUser(input.userId);
  }
}
