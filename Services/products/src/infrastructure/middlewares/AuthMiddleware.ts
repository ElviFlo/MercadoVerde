import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "")
    throw new Error(`[products] Falta la variable de entorno ${name}`);
  return v;
}

const JWT_SECRET = requireEnv("JWT_SECRET");
const JWT_ISS = requireEnv("JWT_ISS"); // para admins
const JWT_AUD = requireEnv("JWT_AUD"); // para clientes
const JWT_ALG = (process.env.JWT_ALG || "HS256") as jwt.Algorithm;

export interface AuthPayload {
  sub: number | string;
  name?: string;
  email?: string;
  role?: "admin" | "client";
  iss?: string;
  aud?: string | string[];
  iat?: number;
  exp?: number;
}

declare global {
  // para que req.user esté tipado
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Verifica el JWT y deja el payload en req.user.
 * OJO: aquí NO forzamos issuer/audience; eso lo validan los guards por rol.
 */
export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Falta Bearer token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALG],
      clockTolerance: 5,
    }) as jwt.JwtPayload;

    // Normalizamos a nuestro tipo
    req.user = {
      sub:
        (payload.sub as any) ?? (payload as any).id ?? (payload as any).userId,
      name: (payload as any).name,
      email: (payload as any).email,
      role: (payload as any).role,
      iss: payload.iss as string | undefined,
      aud: payload.aud as string | string[] | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };

    return next();
  } catch (e: any) {
    console.error("[products] JWT ERROR:", e?.name, e?.message);
    const code = e?.name === "TokenExpiredError" ? 401 : 401;
    return res.status(code).json({ message: "Token inválido o expirado" });
  }
}

/** Guard: solo ADMIN (role + issuer) */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = req.user;
  const ok =
    !!u && u.role === "admin" && typeof u.iss === "string" && u.iss === JWT_ISS;
  if (!ok) return res.status(403).json({ message: "Requiere rol admin" });
  next();
}

/** Guard: solo CLIENT (role + audience) */
export function requireClient(req: Request, res: Response, next: NextFunction) {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autenticado" });

  const hasAud = Array.isArray(u.aud)
    ? u.aud.includes(JWT_AUD)
    : u.aud === JWT_AUD;
  const ok = u.role === "client" && hasAud;
  if (!ok) return res.status(403).json({ message: "Requiere rol client" });
  next();
}

/**
 * Guard útil para endpoints de lectura donde quieres permitir
 * tanto admin como client autenticados.
 */
export function allowAnyAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autenticado" });

  // Admin válido
  if (u.role === "admin" && u.iss === JWT_ISS) return next();

  // Client válido
  const hasAud = Array.isArray(u.aud)
    ? u.aud.includes(JWT_AUD)
    : u.aud === JWT_AUD;
  if (u.role === "client" && hasAud) return next();

  return res.status(403).json({ message: "Prohibido" });
}
