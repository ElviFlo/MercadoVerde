import axios from 'axios';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: CartProduct;
  subtotal: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  totalItems: number;
}

export class CartClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.CART_SERVICE_URL || 'http://cart:3004';
  }

  async getCartById(cartId: string): Promise<CartResponse> {
    const { data } = await axios.get<CartResponse>(
      `${this.baseUrl}/cart/${cartId}`,
    );
    return data;
  }
}