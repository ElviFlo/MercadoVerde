// src/infrastructure/services/cart.client.ts
import axios from "axios";

export interface CartItem {
  id: string;
  productId: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: string;        // cartId
  userId: string;    // dueño del carrito
  items: CartItem[];
  total: number;
  totalItems: number;
}

export class CartService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.CART_URL || "http://cart:3005";
  }

  async getMyCart(authHeader: string): Promise<CartResponse> {
    const { data } = await axios.get(
      `${this.baseUrl}/cart`,
      { headers: { Authorization: authHeader } }
    );

    const raw: any = (data as any).cart ?? data;

    const items: CartItem[] = (raw.items ?? []).map((it: any) => {
      const quantity = Number(it.quantity ?? 0);
      const unitPrice = Number(it.price ?? 0);
      const subtotal = unitPrice * quantity;

      return {
        id: String(it.id ?? ""),
        productId: String(it.productId ?? ""),
        // por ahora no tienes nombre en la respuesta, así que dejamos algo neutro
        nameSnapshot: `Producto ${it.productId ?? ""}`,
        unitPrice,
        quantity,
        subtotal,
      };
    });

    // tomamos cartId y userId del primer item (que es como viene en tu JSON)
    const firstItem = (raw.items ?? [])[0];

    const id = String(firstItem?.cartId ?? raw.id ?? "");
    const userId = String(firstItem?.userId ?? raw.userId ?? "");

    const total = Number(
      raw.total ??
      raw.subtotal ??
      items.reduce((sum, it) => sum + it.subtotal, 0),
    );

    const totalItems = Number(
      raw.totalItems ??
      raw.count ??
      items.reduce((sum, it) => sum + it.quantity, 0),
    );

    return { id, userId, items, total, totalItems };
  }
}
