import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoryTreeUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute() {
    return this.categoryRepo.getTree();
  }
}
