import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty({
    example: 'a3f1bc00-9e5a-4d3b-84d4-7a1f3d0a7f3a',
    description: 'UUID del producto a eliminar del carrito',
  })
  @IsUUID()
  productId!: string;
}
