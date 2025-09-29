import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class CreateCategoryUseCase {
  constructor(@Inject('CategoryRepository') private repo: CategoryRepository) {}

  async execute(input: { name: string; slug?: string; parentId?: string | null; active?: boolean }) {
    const slug = (input.slug ?? input.name).trim().toLowerCase().replace(/\s+/g, '-');
    const exists = await this.repo.findBySlug(slug);
    if (exists) throw new ConflictException('Slug already exists');
    return this.repo.create({ name: input.name, slug, parentId: input.parentId ?? null, active: input.active ?? true });
  }
}
