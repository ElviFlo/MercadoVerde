import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MemoryCategoryRepository implements CategoryRepository {
  private data: Category[] = [
    new Category(randomUUID(), 'Bebidas', 'bebidas', null, true),
    // ejemplo de subcategoría
    // (se reasigna parentId tras crear raíz si lo deseas)
  ];

  async create(data: Omit<Category, 'id'|'createdAt'|'updatedAt'>): Promise<Category> {
    const entity = new Category(randomUUID(), data.name, data.slug, data.parentId ?? null, data.active ?? true);
    this.data.push(entity);
    return entity;
  }

  async update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
    const idx = this.data.findIndex(c => c.id === id);
    if (idx < 0) throw new Error('Category not found');
    this.data[idx] = { ...this.data[idx], ...data, updatedAt: new Date() };
    return this.data[idx];
  }

  async delete(id: string): Promise<void> {
    this.data = this.data.filter(c => c.id !== id);
  }

  async findById(id: string): Promise<Category | null> {
    return this.data.find(c => c.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.data.find(c => c.slug === slug) ?? null;
  }

  async list(params: { q?: string; active?: boolean; parentId?: string | null } = {}): Promise<Category[]> {
    const { q, active, parentId } = params;
    return this.data.filter(c => {
      const okQ = q ? (c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.toLowerCase().includes(q.toLowerCase())) : true;
      const okA = active === undefined ? true : c.active === active;
      const okP = parentId === undefined ? true : (c.parentId ?? null) === (parentId ?? null);
      return okQ && okA && okP;
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }

  async listTree(): Promise<any[]> {
    const byParent = new Map<string | null, Category[]>();
    for (const c of this.data) {
      const key = c.parentId ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    }
    const build = (pid: string | null): any[] =>
      (byParent.get(pid) ?? []).map(n => ({ ...n, children: build(n.id) }));
    return build(null);
  }
}
