import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoryTreeUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}
  execute() { return this.repo.listTree(); }
}
