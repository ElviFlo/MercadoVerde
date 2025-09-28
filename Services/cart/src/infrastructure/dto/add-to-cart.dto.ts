import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ type: 'number', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: 'number', example: 9.99 })
  @IsNumber()
  price: number;
}
