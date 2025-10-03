import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsClient {
  private base = process.env.PRODUCTS_BASE_URL ?? 'http://localhost:3003';

  async getById(id: string, authHeader?: string): Promise<any | null> {
    const res = await fetch(`${this.base}/products/${encodeURIComponent(id)}`, {
      headers: authHeader ? { authorization: authHeader } : {},
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`ProductsClient ${res.status}`);
    return res.json();
  }
}
