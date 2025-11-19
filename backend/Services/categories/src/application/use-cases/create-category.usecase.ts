// src/application/use-cases/create-category.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryDto } from '../../infrastructure/dtos/create-category.dto';
import { slugify } from '../../utils/slugify';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto) {
    const slug = dto.slug ?? slugify(dto.name);
    const parentId = dto.parentId ?? null;

    const newCategory = {
      name: dto.name,
      slug,
      parentId,
      active: dto.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.categoryRepo.create(newCategory);
  }
}
