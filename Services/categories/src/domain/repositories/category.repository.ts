import { Category } from '../entities/category.entity';

export type FindParams = {
  q?: string;
  active?: boolean;
  parentId?: string | null;
};

export type CategoryNode = Category & { children: CategoryNode[] };

export interface CategoryRepository {
  create(data: Omit<Category, 'id'>): Promise<Category>;
  update(id: string, patch: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;

  // 👇 estandariza estos dos nombres
  findAll(params?: FindParams): Promise<Category[]>;
  getTree(): Promise<CategoryNode[]>;
}
