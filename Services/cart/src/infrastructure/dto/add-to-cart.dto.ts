import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: 'a3f1bc00-9e5a-4d3b-84d4-7a1f3d0a7f3a' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 9.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  price!: number;
}
