import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(query?: { q?: string; active?: boolean; parentId?: string | null }) {
    return this.categoryRepo.findAll(query);
  }
}
