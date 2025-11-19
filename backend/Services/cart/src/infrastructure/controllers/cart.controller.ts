// src/infrastructure/controllers/cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.middleware';
import { GetCartSummaryUseCase } from '../../application/use-cases/get-cart-summary.use-case';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';
import { ClearCartUseCase } from '../../application/use-cases/clear-cart.use-case';
import { DecrementItemUseCase } from '../../application/use-cases/decrement-item.use-case';
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
    private readonly decrementItemUseCase: DecrementItemUseCase,
  ) {}

  // 1) GET /cart
  @Get()
  @ApiOperation({
    summary: 'Obtener carrito del usuario autenticado',
    description:
      'Disponible para usuarios con rol **client** o **admin** autenticados. ' +
      'Usa el `sub` del JWT para devolver items, cantidad total y subtotal.',
  })
  @ApiResponse({ status: 200, description: 'Carrito obtenido correctamente.' })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async getByUser(@Req() req: any) {
    const userId = req.user?.sub;
    return this.getCartSummary.execute(userId);
  }

  // 2) POST /cart/items
  @Post('items')
  @ApiOperation({
    summary: 'Agregar producto al carrito',
    description:
      'Agrega o incrementa un producto en el carrito del usuario autenticado (client o admin). ' +
      'Valida con el microservicio de Products que el producto exista y esté activo.',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Item agregado o actualizado en el carrito.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
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

  // 3) PATCH /cart/items/{productId}/decrement
  @Patch('items/:productId/decrement')
  @ApiOperation({
    summary: 'Disminuir en 1 la cantidad de un producto en el carrito',
    description:
      'Disminuye en 1 la cantidad del producto indicado en el carrito del usuario autenticado. ' +
      'Si la cantidad ya es 1, el item se mantiene y no se elimina. Pensado para flujo de client y admin.',
  })
  @ApiParam({ name: 'productId', description: 'ID del producto a decrementar' })
  @ApiResponse({
    status: 200,
    description: 'Carrito actualizado después de decrementar el producto.',
  })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async decrementItem(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.sub;

    await this.decrementItemUseCase.execute({ userId, productId });

    // devolvemos el resumen actualizado, igual que en remove
    return this.getCartSummary.execute(userId);
  }

  // 4) DELETE /cart/items/{productId}
  @Delete('items/:productId')
  @ApiOperation({
    summary: 'Eliminar un producto del carrito',
    description:
      'Elimina del carrito del usuario autenticado el producto indicado por `productId`. ' +
      'Operación idempotente: si el producto no está, no falla.',
  })
  @ApiParam({ name: 'productId', description: 'ID del producto a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Carrito actualizado después de eliminar el producto.',
  })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido.' })
  async removeItem(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.sub;
    await this.removeFromCart.execute({ userId, productId });
    return this.getCartSummary.execute(userId);
  }

  // 5) DELETE /cart
  @Delete()
  @ApiOperation({
    summary: 'Vaciar carrito',
    description:
      'Elimina todos los items del carrito del usuario autenticado (client o admin).',
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
