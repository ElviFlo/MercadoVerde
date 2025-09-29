import { Category } from '../entities/category.entity';

export interface CategoryRepository {
  create(data: Omit<Category, 'id'|'createdAt'|'updatedAt'>): Promise<Category>;
  update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  list(params?: { q?: string; active?: boolean; parentId?: string | null }): Promise<Category[]>;
  listTree(): Promise<any[]>;
}
