// src/infrastructure/dtos/create-category.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Café Molido', description: 'Nombre de la categoría' })
  @IsString()
  @IsNotEmpty()
  name!: string; // <- definite assignment

  @ApiPropertyOptional({
    example: 'cafe-molido',
    description: 'Slug único; si no lo envías se genera desde name',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    nullable: true,
    example: null,
    description: 'UUID del padre; null si es raíz',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @ApiProperty({ example: true, default: true, description: 'Estado de la categoría' })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true; // <- default para evitar TS2564
}
