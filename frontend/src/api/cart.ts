// src/api/cart.ts
const CART_BASE_URL =
  import.meta.env.VITE_CART_BASE_URL ?? "http://localhost:3005";

type JwtPayload = {
  id?: string | number;
  userId?: string | number;
  sub?: string | number;
  email?: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Obtiene el userId desde el token, o null si no hay usuario.
 */
function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(
      Math.ceil(payloadBase64.length / 4) * 4,
      "=",
    );
    const json = atob(padded);
    const payload = JSON.parse(json) as JwtPayload;

    const userId =
      payload.id ?? payload.userId ?? payload.sub ?? payload.email;

    return userId != null ? String(userId) : null;
  } catch {
    return null;
  }
}

/**
 * Key en localStorage donde se guarda el cartId del usuario actual.
 * - Invitado: "mv_cart_id:guest"
 * - Usuario logueado: "mv_cart_id:user:<userId>"
 */
export function getCartIdStorageKey(): string {
  const userId = getUserIdFromToken();
  if (!userId) return "mv_cart_id:guest";
  return `mv_cart_id:user:${userId}`;
}

// Asegura que existe un cartId en localStorage
export async function ensureCartId(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Cart is only available in the browser");
  }

  const storageKey = getCartIdStorageKey();

  let cartId = localStorage.getItem(storageKey);
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

  localStorage.setItem(storageKey, cartId);
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
    const storageKey = getCartIdStorageKey();
    localStorage.setItem(storageKey, data.cartId);
  }
  return data;
}
