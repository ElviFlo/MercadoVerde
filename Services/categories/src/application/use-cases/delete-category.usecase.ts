import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(id: string) {
    return this.categoryRepo.delete(id);
  }
}
