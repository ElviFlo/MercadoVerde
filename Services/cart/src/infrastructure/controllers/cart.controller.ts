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

@ApiTags('Cart')                    // 👈 un solo tag
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

  // 3) DELETE /cart/items/{productId}
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

  // 4) DELETE /cart
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
