import { Injectable } from '@nestjs/common';
import { CategoryRepository, FindParams, CategoryNode } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MemoryCategoryRepository implements CategoryRepository {
  private data: Category[] = [];

  async create(input: Omit<Category, 'id'>): Promise<Category> {
    const created: Category = { id: randomUUID(), ...input };
    this.data.push(created);
    return created;
  }

  async update(id: string, patch: Partial<Category>): Promise<Category> {
    const idx = this.data.findIndex(c => c.id === id);
    if (idx < 0) throw new Error('Category not found');
    const updated = { ...this.data[idx], ...patch, updatedAt: patch.updatedAt ?? new Date() };
    this.data[idx] = updated;
    return updated;
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

  async findAll(params: FindParams = {}): Promise<Category[]> {
    const { q, active, parentId } = params;
    return this.data.filter(c => {
      if (q && !(c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.includes(q.toLowerCase()))) return false;
      if (active !== undefined && c.active !== active) return false;
      if (parentId === null && c.parentId !== null) return false;      // solo raíces
      if (parentId !== undefined && parentId !== null && c.parentId !== parentId) return false;
      return true;
    });
  }

  async getTree(): Promise<CategoryNode[]> {
    const byParent = new Map<string | null, CategoryNode[]>();
    for (const c of this.data) {
      const node: CategoryNode = { ...c, children: [] };
      const arr = byParent.get(c.parentId ?? null) ?? [];
      arr.push(node);
      byParent.set(c.parentId ?? null, arr);
    }
    const attach = (parentId: string | null): CategoryNode[] =>
      (byParent.get(parentId) ?? []).map(n => ({ ...n, children: attach(n.id) }));
    return attach(null);
  }
}
