import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}
  async execute(id: string) {
    const cat = await this.repo.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }
}
