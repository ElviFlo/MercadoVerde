// src/infrastructure/controllers/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt.middleware';

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
    const authHeader = req.headers['authorization'] as string | undefined;
    return this.addUC.execute({
      userId,
      productId: dto.productId,
      quantity: dto.quantity,
      authHeader,
    });
  }

  // ÚNICO DELETE que queda: borra por path param (UUID o entero)
  @Delete('items/:productId')
  @ApiParam({
    name: 'productId',
    description: 'ID del producto (UUID o entero)',
    schema: { oneOf: [{ type: 'integer', example: 1 }, { type: 'string', example: '07f8a883-a691-4829-b671-ac8845a72961' }] },
  })
  async removeItemByParam(@Req() req: any, @Param('productId') productId: string) {
    const userId: string = req.user?.sub ?? req.user?.id;
    await this.removeUC.execute({ userId, productId: String(productId) });
    return { ok: true };
  }

  @Delete('clear')
  async clear(@Req() req: any) {
    const userId: string = req.user?.sub ?? req.user?.id;
    const items = await this.getUC.execute(userId);
    for (const it of items) {
      await this.removeUC.execute({ userId, productId: it.productId });
    }
    return { ok: true };
  }
}
