import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}
  async execute(id: string, data: Partial<{ name: string; slug: string; parentId: string | null; active: boolean }>) {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    return this.repo.update(id, data);
  }
}
