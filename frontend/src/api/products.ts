// frontend/src/api/products.ts
import type {
  Product,
  ProductType as BaseProductType,
} from "../data/products";

const BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL ?? "http://localhost:3003";

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  type: BaseProductType;
  stock: number;
  imageUrl?: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  type?: BaseProductType;
  stock?: number;
  imageUrl?: string | null;
  active?: boolean;
}

// 🔐 Para endpoints que REQUIEREN estar logueado (create, update, delete)
function getAuthHeadersRequired() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated or token missing");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// 🟢 Para endpoints públicos (GET): si hay token lo manda, si no, nada
function getOptionalAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeadersRequired(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error creando producto: ${res.status} ${text}`);
  }

  const product = (await res.json()) as Product;
  return product;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: {
      "Content-Type": "application/json",
      ...getOptionalAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error obteniendo productos: ${res.status} ${text}`);
  }

  const products = (await res.json()) as Product[];
  return products;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getOptionalAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error obteniendo producto: ${res.status} ${text}`);
  }

  const product = (await res.json()) as Product;
  return product;
}

// 📝 UPDATE product (solo admin)
export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeadersRequired(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error actualizando producto: ${res.status} ${text}`);
  }

  const updated = (await res.json()) as Product;
  return updated;
}

// 🗑️ DELETE product (solo admin)
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeadersRequired(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error eliminando producto: ${res.status} ${text}`);
  }

  // 200/204 sin body → simplemente resolvemos
}
