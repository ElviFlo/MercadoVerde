import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { IsUuidOrInt } from '../validators/is-uuid-or-int';

export class AddToCartDto {
  @ApiProperty({ oneOf: [{ type: 'integer', example: 1 }, { type: 'string', example: '07f8a883-a691-4829-b671-ac8845a72961' }] })
  @IsUuidOrInt()
  productId!: number | string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
