// src/api/cart.ts
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

// Asegura que existe un cartId en localStorage
export async function ensureCartId(): Promise<string> {
  let cartId = localStorage.getItem("mv_cart_id");
  if (cartId) return cartId;

  // ⚠️ Ajusta la ruta según tu Cart service
  const res = await fetch(`${CART_BASE_URL}/cart`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error("Could not initialize cart");
  }

  const data = (await res.json()) as { id?: string; cartId?: string };
  cartId = data.cartId ?? data.id;
  if (!cartId) throw new Error("Cart backend did not return a cartId");

  localStorage.setItem("mv_cart_id", cartId);
  return cartId;
}

// Añadir item al carrito en el backend
export async function addItemToCartBackend(params: {
  productId: string;
  quantity: number;
}) {
  const cartId = await ensureCartId();

  // ⚠️ Ajusta ruta/body al contrato real de tu micro Cart
  const res = await fetch(`${CART_BASE_URL}/cart/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      cartId,
      productId: params.productId,
      quantity: params.quantity,
    }),
  });

  if (!res.ok) {
    throw new Error("Could not add item to cart");
  }

  const data = await res.json();
  if (data.cartId && data.cartId !== cartId) {
    localStorage.setItem("mv_cart_id", data.cartId);
  }
  return data;
}
