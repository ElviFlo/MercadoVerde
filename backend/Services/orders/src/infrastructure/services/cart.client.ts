import axios from "axios";

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

/**
 * Servicio HTTP para hablar con el microservicio de Cart
 */
export class CartService {
  private readonly baseUrl: string;

  constructor() {
    // Usa la env del docker-compose de orders
    this.baseUrl = process.env.CART_URL || "http://cart:3005";
  }

  // 👇 Siempre trae el carrito del usuario del token,
  // no recibe cartId.
  async getMyCart(authHeader: string): Promise<CartResponse> {
    const { data } = await axios.get<CartResponse>(
      `${this.baseUrl}/cart`,
      {
        headers: { Authorization: authHeader },
      }
    );
    return data;
  }
}
