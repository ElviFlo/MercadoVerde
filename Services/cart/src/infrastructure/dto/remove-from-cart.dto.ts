// src/infrastructure/dto/remove-from-cart.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUuidOrInt } from '../validators/is-uuid-or-int';

export class RemoveFromCartDto {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'a3f1bc00-9e5a-4d3b-84d4-7a1f3d0a7f3a' },
      { type: 'integer', example: 1 },
    ],
    description: 'Identificador del producto (UUID o entero)',
  })
  @IsUuidOrInt()
  productId!: string | number;
}
