import { Module } from '@nestjs/common';
import { CartController } from './infrastructure/controllers/cart.controller';

import { CartRepository } from './infrastructure/repositories/cart.repository';
import { CartRepositoryImpl } from './infrastructure/repositories/cart.repository.impl';

import { AddToCartUseCase } from './application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from './application/use-cases/remove-from-cart.use-case';

@Module({
  controllers: [CartController],
  providers: [
    { provide: 'CartRepository', useClass: CartRepositoryImpl },
    CartRepositoryImpl, // por si inyectas por tipo en algún lugar
    AddToCartUseCase,
    GetCartUseCase,
    RemoveFromCartUseCase,
  ],
})
export class AppModule {}
