import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, Length } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '07f8a883-a691-4829-b671-ac8845a72961' })
  @IsString()
  @Length(1, 120)
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity!: number;
}
