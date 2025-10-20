import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.middleware';
import { GetCartSummaryUseCase } from '../../application/use-cases/get-cart-summary.use-case';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly getCartSummary: GetCartSummaryUseCase,
    private readonly addToCart: AddToCartUseCase,
  ) {}

  // ✅ GET /cart → carrito completo con subtotal y cantidad
  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user?.sub ?? 'superadmin';
    return this.getCartSummary.execute(userId);
  }

  // ✅ GET /cart/items → lista cruda (por compatibilidad)
  @Get('items')
  async getItems(@Req() req: any) {
    const userId = req.user?.sub ?? 'superadmin';
    const summary = await this.getCartSummary.execute(userId);
    return { value: summary.items, Count: summary.count };
  }

  // ✅ POST /cart/items → agregar producto al carrito
  @Post('items')
  async addItem(
    @Body() body: { productId: string; quantity: number; price?: number },
    @Req() req: any,
  ) {
    const userId = req.user?.sub ?? 'superadmin';
    const authHeader = req.headers['authorization'] as string | undefined;
    return this.addToCart.execute({
      userId,
      productId: body.productId,
      quantity: body.quantity,
      authHeader,
    });
  }
}
