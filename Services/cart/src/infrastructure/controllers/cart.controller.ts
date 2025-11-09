// src/infrastructure/controllers/cart.controller.ts
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
import { JwtAuthGuard } from '../auth/jwt.middleware';
import { GetCartSummaryUseCase } from '../../application/use-cases/get-cart-summary.use-case';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';
import { ClearCartUseCase } from '../../application/use-cases/clear-cart.use-case';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth('bearerAuth')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly getCartSummary: GetCartSummaryUseCase,
    private readonly addToCart: AddToCartUseCase,
    private readonly removeFromCart: RemoveFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener carrito del usuario autenticado',
    description:
      'Retorna el resumen del carrito asociado al usuario del token JWT (claim `sub`): items, cantidad total y subtotal.',
  })
  @ApiResponse({ status: 200, description: 'Carrito obtenido correctamente.' })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async getByUser(@Req() req: any) {
    const userId = req.user?.sub;
    return this.getCartSummary.execute(userId);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Agregar producto al carrito (addItem)',
    description:
      'Agrega un producto al carrito del usuario autenticado. ' +
      'Si el producto ya existe en el carrito, incrementa la cantidad. ' +
      'Valida con el microservicio de Products que el producto exista y esté activo.',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Item agregado o actualizado en el carrito.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos (productId faltante, quantity <= 0 o producto inactivo).',
  })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async addItem(@Body() body: AddToCartDto, @Req() req: any) {
    const userId = req.user?.sub;
    const authHeader = req.headers['authorization'] as string | undefined;

    return this.addToCart.execute({
      userId,
      productId: body.productId,
      quantity: body.quantity,
      authHeader,
    });
  }

  @Delete('items/:productId')
  @ApiOperation({
    summary: 'Eliminar un producto del carrito (removeItem)',
    description:
      'Elimina del carrito el producto indicado por `productId` para el usuario autenticado. ' +
      'Si el producto no existe, la operación no falla (idempotente).',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID del producto a eliminar del carrito',
  })
  @ApiResponse({
    status: 200,
    description:
      'Carrito actualizado después de eliminar el producto (o igual si no existía).',
  })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async removeItem(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.sub;
    await this.removeFromCart.execute({ userId, productId });
    return this.getCartSummary.execute(userId);
  }

  @Delete()
  @ApiOperation({
    summary: 'Vaciar carrito (clear)',
    description:
      'Elimina todos los items del carrito del usuario autenticado. ' +
      'Útil después de un checkout exitoso o cuando el usuario quiere empezar desde cero.',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito vaciado correctamente.',
  })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async clear(@Req() req: any) {
    const userId = req.user?.sub;
    await this.clearCartUseCase.execute(userId);
    return { message: 'Cart cleared' };
  }
}
