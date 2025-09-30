// src/infrastructure/dto/add-to-cart.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: '07f8a883-a691-4829-b671-ac8845a72961',
    description: 'UUID del producto',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1, description: 'Cantidad' })
  @IsInt()
  @Min(1)
  quantity!: number;
}
