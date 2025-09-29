import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';

import { AddToCartDto } from '../dto/add-to-cart.dto';
import { RemoveFromCartDto } from '../dto/remove-from-cart.dto';

// src/infrastructure/controllers/cart.controller.ts
import { JwtAuthGuard } from '../auth/jwt.middleware';
;

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private readonly addUC: AddToCartUseCase,
    private readonly getUC: GetCartUseCase,
    private readonly removeUC: RemoveFromCartUseCase,
  ) {}

  @Get('items')
  getItems(@Req() req: any) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.getUC.execute(userId);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() dto: AddToCartDto) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.addUC.execute({
      userId,
      productId: dto.productId, // UUID string
      quantity: dto.quantity,
      price: dto.price,
    });
  }

  @Delete('items')
  removeItemByBody(@Req() req: any, @Body() dto: RemoveFromCartDto) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.removeUC.execute({ userId, productId: dto.productId });
  }

  @Delete('items/:productId')
  @ApiParam({
    name: 'productId',
    description: 'UUID del producto',
    example: 'a3f1bc00-9e5a-4d3b-84d4-7a1f3d0a7f3a',
  })
  removeItemByParam(@Req() req: any, @Param('productId') productId: string) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.removeUC.execute({ userId, productId });
  }

  @Delete('clear')
  async clear(@Req() req: any) {
    const userId: string = req.user?.sub ?? req.user?.id;
    const items = await this.getUC.execute(userId);
    for (const it of items) {
      await this.removeUC.execute({ userId, productId: it.productId });
    }
    return { ok: true, cleared: items.length };
  }
}
