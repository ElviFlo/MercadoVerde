import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../domain/entities/order.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED'] })
  @IsEnum(['PENDING', 'PAID', 'CANCELLED'], {
    message: 'status must be one of PENDING | PAID | CANCELLED',
  })
  status!: OrderStatus;
}
