// src/cartStorage.ts

export type CartItemData = {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type JwtPayload = {
  id?: string | number;
  userId?: string | number;
  sub?: string | number;
  email?: string;
};

/**
 * Devuelve un identificador de usuario a partir del JWT, o null si no hay usuario.
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
 * Genera la clave de localStorage para el carrito del usuario actual.
 * - Invitado: "mv_cart_v1:guest"
 * - Usuario logueado: "mv_cart_v1:user:<userId>"
 */
function getCartStorageKey(): string {
  const userId = getUserIdFromToken();
  if (!userId) return "mv_cart_v1:guest";
  return `mv_cart_v1:user:${userId}`;
}

export function getCartItems(): CartItemData[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(getCartStorageKey());
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Sanitizar un poco por si hay cosas raras
    return parsed.map((item: any) => ({
      id: String(item.id),
      name: String(item.name ?? ""),
      type: String(item.type ?? ""),
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
      imageUrl: String(item.imageUrl ?? "/plants/plant-placeholder.png"),
    }));
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItemData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
}

export function clearCartItems() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getCartStorageKey());
}

/**
 * Añade un item al carrito local del usuario actual.
 * - Puedes llamar: addItemToLocalCart({ ...producto, quantity: 3 })
 * - O: addItemToLocalCart(producto, 3)
 */
export function addItemToLocalCart(
  product: {
    id: string | number;
    name: string;
    type: string;
    price: number;
    imageUrl: string;
    quantity?: number;
  },
  quantityArg?: number,
) {
  const items = getCartItems();

  // Usar primero el quantity explícito, luego el del objeto, luego 1
  const quantity = Math.max(
    1,
    quantityArg ?? product.quantity ?? 1,
  );

  const id = String(product.id);

  const existingIndex = items.findIndex((i) => i.id === id);

  if (existingIndex >= 0) {
    const existing = items[existingIndex];
    const newQty = existing.quantity + quantity;
    items[existingIndex] = { ...existing, quantity: newQty };
  } else {
    items.push({
      id,
      name: product.name,
      type: product.type,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl || "/plants/plant-placeholder.png",
    });
  }

  setCartItems(items);
  return items;
}
