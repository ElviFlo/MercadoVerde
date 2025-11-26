export type CartItemData = {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const CART_KEY = "mv_cart_v1";

export function getCartItems(): CartItemData[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
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
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addItemToLocalCart(
  product: {
    id: string;
    name: string;
    type: string;
    price: number;
    imageUrl: string;
  },
  quantity: number = 1,
) {
  const items = getCartItems();
  const existingIndex = items.findIndex((i) => i.id === product.id);

  if (existingIndex >= 0) {
    const existing = items[existingIndex];
    const newQty = existing.quantity + Math.max(1, quantity);
    items[existingIndex] = { ...existing, quantity: newQty };
  } else {
    items.push({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: Math.max(1, quantity),
      imageUrl: product.imageUrl || "/plants/plant-placeholder.png",
    });
  }

  setCartItems(items);
  return items;
}
