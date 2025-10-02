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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.use-case';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt.middleware';
import { ClientRoleGuard } from '../auth/role.guard';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // JWT requerido para todo el controller
@Controller('cart')
export class CartController {
  constructor(
    private readonly addUC: AddToCartUseCase,
    private readonly getUC: GetCartUseCase,
    private readonly removeUC: RemoveFromCartUseCase,
  ) {}

  @Get('items')
  @UseGuards(ClientRoleGuard)
  @ApiOperation({ summary: 'Listar items del carrito (client)' })
  @ApiOkResponse({ description: 'Listado de items' })
  @ApiUnauthorizedResponse({ description: 'Token ausente / inválido' })
  @ApiForbiddenResponse({ description: 'Requiere rol client' })
  getItems(@Req() req: any) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.getUC.execute(userId);
  }

  @Post('items')
  @UseGuards(ClientRoleGuard)
  @ApiOperation({ summary: 'Agregar item al carrito (client)' })
  @ApiOkResponse({ description: 'Item agregado/actualizado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente / inválido' })
  @ApiForbiddenResponse({ description: 'Requiere rol client' })
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

  @Delete('items')
  @UseGuards(ClientRoleGuard)
  @ApiOperation({ summary: 'Eliminar item por body (client)' })
  removeItemByBody(@Req() req: any, @Body() body: { productId: string }) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.removeUC.execute({ userId, productId: body.productId });
  }

  @Delete('items/:productId')
  @UseGuards(ClientRoleGuard)
  @ApiOperation({ summary: 'Eliminar item por parámetro (client)' })
  @ApiParam({
    name: 'productId',
    description: 'UUID del producto',
    example: '07f8a883-a691-4829-b671-ac8845a72961',
  })
  removeItemByParam(@Req() req: any, @Param('productId') productId: string) {
    const userId: string = req.user?.sub ?? req.user?.id;
    return this.removeUC.execute({ userId, productId });
  }

  @Delete('clear')
  @UseGuards(ClientRoleGuard)
  @ApiOperation({ summary: 'Vaciar carrito actual (client)' })
  async clear(@Req() req: any) {
    const userId: string = req.user?.sub ?? req.user?.id;
    const items = await this.getUC.execute(userId);
    for (const it of items) {
      await this.removeUC.execute({ userId, productId: it.productId });
    }
    return { ok: true };
  }
}
