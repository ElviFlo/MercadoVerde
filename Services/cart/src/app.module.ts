import { Module } from '@nestjs/common';
import { CartController } from './infrastructure/controllers/cart.controller';

@Module({
  controllers: [CartController],
})
export class AppModule {}
