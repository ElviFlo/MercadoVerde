import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoriesUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}
  execute(params: { q?: string; active?: boolean; parentId?: string | null }) {
    return this.repo.list(params);
  }
}
