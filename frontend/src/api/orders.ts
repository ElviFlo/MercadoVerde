// src/api/orders.ts
// (dejo solo lo importante: tipo y función de crear orden)

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
  status: string;       // 'PAID'
  total: number;
  totalItems: number;
  createdAt: string;
  customerName?: string;
  items: OrderItemDTO[];
};

// 🔁 AHORA: recibe solo cartId y manda { cartId }
export async function createOrderFromCartId(cartId: string): Promise<OrderDTO> {
  if (!cartId) {
    throw new Error("cartId is required");
  }

  const res = await fetch(`${ORDERS_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ cartId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = "Error creating order";
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await res.json()) as OrderDTO;
  return data;
}

export async function getMyOrders(): Promise<OrderDTO[]> {
  const res = await fetch(`${ORDERS_BASE_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = "Error loading orders";
    try {
      const data = JSON.parse(text);
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await res.json()) as OrderDTO[];
  return data;
}
