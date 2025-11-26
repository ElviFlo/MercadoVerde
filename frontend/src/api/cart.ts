// src/api/cart.ts

import type { CartItemData } from "../cartStorage";

const CART_BASE_URL =
  import.meta.env.VITE_CART_BASE_URL ?? "http://localhost:3005";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function addItemToCartBackend(params: {
  productId: string;
  quantity: number;
}) {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const res = await fetch(`${CART_BASE_URL}/cart/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      productId: params.productId,
      quantity: params.quantity,
    }),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    let message = "Could not add item to cart";
    try {
      const data = JSON.parse(text);
      if (data?.message) {
        message = data.message; // aquí entrará "Producto inactivo"
      }
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  return text ? JSON.parse(text) : {};
}

// Vaciar carrito remoto (lo dejamos igual)
export async function clearBackendCart() {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const res = await fetch(`${CART_BASE_URL}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Could not clear backend cart");
  }
}

/**
 * Sincroniza el carrito local con el backend:
 * - Vacía el carrito remoto.
 * - Intenta agregar todos los items.
 * Si falla uno, lanza un error indicando qué producto dio problema.
 */
export async function syncLocalCartToBackend(items: CartItemData[]) {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  await clearBackendCart();

  for (const item of items) {
    if (item.quantity <= 0) continue;

    try {
      await addItemToCartBackend({
        productId: item.id,
        quantity: item.quantity,
      });
    } catch (err: any) {
      const baseMsg =
        err instanceof Error ? err.message : "Unknown error adding item";
      // 👇 mensaje más amigable: incluye el nombre del producto
      throw new Error(
        `Error adding "${item.name}" to your cart: ${baseMsg}`,
      );
    }
  }
}
