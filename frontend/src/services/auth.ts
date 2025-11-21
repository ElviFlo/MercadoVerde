// src/services/auth.ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
// ajusta el puerto /ruta según tu gateway

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginApi(payload: LoginPayload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include", // si usas cookies; quítalo si solo usas JWT en header
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Login failed");
  }

  return res.json(); // aquí normalmente viene { accessToken, user }
}

export async function signupApi(payload: SignupPayload) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Signup failed");
  }

  return res.json();
}
