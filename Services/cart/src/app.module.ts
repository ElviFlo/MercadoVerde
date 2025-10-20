import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './infrastructure/controllers/cart.controller';
import { GetCartSummaryUseCase } from './application/use-cases/get-cart-summary.use-case';
import { AddToCartUseCase } from './application/use-cases/add-to-cart.use-case';

import { CART_REPO } from './infrastructure/repositories/cart.repository';
import { CartRepositoryImpl } from './infrastructure/repositories/cart.repository.impl';
import { ProductsClient } from './infrastructure/clients/products.client';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [CartController],
  providers: [
    // 🧠 Casos de uso
    GetCartSummaryUseCase,
    AddToCartUseCase,

    // 🌐 Cliente HTTP a products_service
    ProductsClient,

    // 🗄️ Implementación del repositorio
    { provide: CART_REPO, useClass: CartRepositoryImpl },
  ],
})
export class AppModule {}
