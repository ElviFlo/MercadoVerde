// Services/orders/src/infrastructure/services/products.client.ts
import axios from "axios";

const base = process.env.SERVICE_PRODUCTS_BASE_URL || "http://localhost:3003";

/**
 * Obtiene 1 producto por id desde Products Service.
 * - products tiene id numérico; aquí recibimos string y lo convertimos si aplica.
 */
export async function fetchProduct(productId: string, authHeader?: string) {
  // Si tus products usan id numérico, intenta convertir:
  const idForUrl = isNaN(Number(productId)) ? productId : Number(productId);
  const url = `${base}/products/${idForUrl}`;
  const res = await axios.get(url, {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  return res.data; // { id, name, price, ... }
}

export async function reserveProduct(productId: string, quantity: number) {
  const url = `${base}/products/${productId}/reserve`;
  const res = await axios.post(url, { quantity });
  return res.data; // { ok, remaining }
}

export async function releaseProduct(productId: string, quantity: number) {
  const url = `${base}/products/${productId}/release`;
  const res = await axios.post(url, { quantity });
  return res.data;
}
