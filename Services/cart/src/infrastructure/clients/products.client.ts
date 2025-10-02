// src/infrastructure/clients/products.client.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

@Injectable()
export class ProductsClient {
  constructor(private readonly http: HttpService) {}

  async getById(productId: string, authHeader?: string): Promise<ProductDTO> {
    const base = process.env.PRODUCTS_BASE_URL ?? 'http://products:3003';

    // Config tipado para axios
    const cfg: AxiosRequestConfig = {};
    if (authHeader) {
      cfg.headers = { Authorization: authHeader };
    }

    // Observable -> AxiosResponse<ProductDTO>
    const obs = this.http.get<ProductDTO>(${base}/products/${productId}, cfg);
    const resp = await firstValueFrom<AxiosResponse<ProductDTO>>(obs);

    const data = resp.data;
    if (!data) throw new NotFoundException('Product not found');
    return data;
  }
}