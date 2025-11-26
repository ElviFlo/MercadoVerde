// src/api/orders.ts

const ORDERS_BASE_URL =
  import.meta.env.VITE_ORDERS_BASE_URL ?? "http://localhost:3002";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export type OrderItemDTO = {
  productId: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderDTO = {
  id: string;
  status: string; // 'PAID'
  total: number;
  totalItems: number;
  createdAt: string;
  customerName?: string;
  items: OrderItemDTO[];
};

// 👉 POST /orders  (crear orden usando el carrito del usuario autenticado)
export async function createOrderFromCart(): Promise<OrderDTO> {
  const res = await fetch(`${ORDERS_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({}), // body vacío (ajusta si tu backend espera otra cosa)
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    let message = "Error creando la orden";
    try {
      const data = JSON.parse(text);
      if (data?.message) {
        message = data.message;
      }
    } catch {
      if (text) {
        // si el backend devuelve texto plano, lo usamos como mensaje
        message = text;
      }
    }
    throw new Error(message);
  }

  // si fue bien, parseamos el JSON
  const data = (text ? JSON.parse(text) : {}) as OrderDTO;
  return data;
}

// 👉 GET /orders/mine  (listar MIS órdenes)
export async function getMyOrders(): Promise<OrderDTO[]> {
  const res = await fetch(`${ORDERS_BASE_URL}/orders/mine`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    let message = "Error loading orders";
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = (text ? JSON.parse(text) : []) as OrderDTO[];
  return data;
}
