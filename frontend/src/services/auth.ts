// src/services/auth.ts
const API_BASE = "http://localhost:3001/auth";

export type LoginPayload = {
  email?: string;
  name?: string;
  password: string;
};

export type LoginResponse = {
  role: "admin" | "client";
  accessToken: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type ErrorResponse = {
  message?: string;
};

// Utilidad para construir un Error a partir de la respuesta
async function buildError(res: Response): Promise<Error> {
  let body: unknown = null;

  try {
    body = await res.json();
  } catch {
    // puede no haber JSON, lo ignoramos
  }

  const data = body as ErrorResponse | null;
  const msg = data?.message ?? `${res.status} ${res.statusText}`;
  return new Error(msg);
}

// Intenta login como admin y, si no, como cliente
export async function loginApi(
  payload: LoginPayload
): Promise<LoginResponse> {
  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  // 1) Intento admin
  const adminRes = await fetch(`${API_BASE}/login/admin`, options);
  if (adminRes.ok) {
    return (await adminRes.json()) as LoginResponse;
  }

  // 2) Intento client (solo si fallo anterior no es por red)
  const clientRes = await fetch(`${API_BASE}/login/client`, options);
  if (clientRes.ok) {
    return (await clientRes.json()) as LoginResponse;
  }

  throw await buildError(clientRes);
}

// Registro de usuario (cliente)
export async function signupApi(payload: SignupPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    // 201 Created, no hace falta devolver nada
    return;
  }

  throw await buildError(res);
}
