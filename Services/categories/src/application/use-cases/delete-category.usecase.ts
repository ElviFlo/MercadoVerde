import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}
  async execute(id: string) {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    await this.repo.delete(id);
    return { ok: true };
  }
}
