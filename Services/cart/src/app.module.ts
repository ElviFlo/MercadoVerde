// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CartController } from './infrastructure/controllers/cart.controller';

import { CART_REPO } from './infrastructure/repositories/cart.repository';
import { CartRepositoryImpl } from './infrastructure/repositories/cart.repository.impl';

import { AddToCartUseCase } from './application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from './application/use-cases/remove-from-cart.use-case';

import { ProductsClient } from './infrastructure/clients/products.client';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CartController],
  providers: [
    { provide: CART_REPO, useClass: CartRepositoryImpl },
    CartRepositoryImpl, // por si en algún sitio inyectas por tipo
    ProductsClient,
    AddToCartUseCase,
    GetCartUseCase,
    RemoveFromCartUseCase,
  ],
})
export class AppModule {}
