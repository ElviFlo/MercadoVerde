globalThis.fetch // si usas Node >=18 puedes omitir y usar global fetch; si no: npm i node-fetch@3
export class CartClient {
  constructor(private base = process.env.CART_BASE_URL ?? "http://localhost:3005") {}

  async addItem(opts: { productId: string | number; quantity: number; authHeader?: string }) {
    const res = await fetch(`${this.base}/cart/items`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(opts.authHeader ? { authorization: opts.authHeader } : {}),
      },
      body: JSON.stringify({ productId: opts.productId, quantity: opts.quantity }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`CartClient ${res.status}: ${body || res.statusText}`);
    }
    return res.json();
  }
}
