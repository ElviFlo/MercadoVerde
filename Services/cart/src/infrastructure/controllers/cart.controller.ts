import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  private getCart = new GetCartUseCase();
  private addToCart = new AddToCartUseCase();
  private removeFromCart = new RemoveFromCartUseCase();

  @ApiParam({ name: 'userId', type: Number })
  @Get(':userId')
  async getCartByUser(@Param('userId') userId: string) {
    return this.getCart.execute(Number(userId));
  }

  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: AddToCartDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post(':userId/items')
  async addItem(
    @Param('userId') userId: string,
    @Body() body: AddToCartDto
  ) {
    return this.addToCart.execute(Number(userId), body.productId, body.quantity, body.price);
  }

  @ApiParam({ name: 'itemId', type: String })
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    return this.removeFromCart.execute(itemId);
  }
}
