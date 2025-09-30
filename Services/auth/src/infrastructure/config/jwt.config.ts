import type { SignOptions } from "jsonwebtoken";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim() === "") {
    throw new Error(`[auth] Falta la variable de entorno ${name}`);
  }
  return val;
}

function asExpiresIn(v?: string): SignOptions["expiresIn"] {
  if (!v) return "1h";
  const n = Number(v);
  return Number.isFinite(n) ? n : (v as unknown as SignOptions["expiresIn"]);
}

export const jwtConfig = {
  secret: requireEnv("JWT_SECRET"),
  accessTtl: asExpiresIn(process.env.JWT_ACCESS_TTL),
  refreshTtl: asExpiresIn(process.env.JWT_REFRESH_TTL) || "7d",
  issuer: requireEnv("JWT_ISS"), // 👈 obligatorio (admin)
  audience: requireEnv("JWT_AUD"), // 👈 obligatorio (cliente)
};
