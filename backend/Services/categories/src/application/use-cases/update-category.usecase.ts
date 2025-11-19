import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { UpdateCategoryDto } from '../../infrastructure/dtos/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateCategoryDto) {
    return this.categoryRepo.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
  }
}
