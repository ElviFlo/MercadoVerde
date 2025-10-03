import { Module } from '@nestjs/common';
import { CartController } from '../infrastructure/controllers/cart.controller';
import { AddToCartUseCase } from '../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from '../application/use-cases/remove-from-cart.use-case';
import { CART_REPO } from '../infrastructure/repositories/cart.repository';
import { CartRepositoryImpl } from '../infrastructure/repositories/cart.repository.impl';
import { JwtAuthGuard } from '../infrastructure/auth/jwt.middleware';
import { ProductsClient } from '../infrastructure/clients/products.client';

@Module({
  controllers: [CartController],
  providers: [
    AddToCartUseCase,
    GetCartUseCase,
    RemoveFromCartUseCase,
    ProductsClient,
    JwtAuthGuard,
    { provide: CART_REPO, useClass: CartRepositoryImpl }, // in-memory
  ],
})
export class CartModule {}
