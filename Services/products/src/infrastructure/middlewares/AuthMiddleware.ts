import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`[products] Falta la variable de entorno ${name}`);
  }
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
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * ✅ Verifica el JWT y deja el payload en req.user.
 * No fuerza issuer/audience aquí; lo validan los guards por rol.
 */
export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
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

    // Normalizamos y convertimos el rol a minúsculas
    req.user = {
      sub:
        (payload.sub as any) ??
        (payload as any).id ??
        (payload as any).userId,
      name: (payload as any).name,
      email: (payload as any).email,
      role: ((payload as any).role ?? "").toString().toLowerCase() as any,
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

/** ✅ Guard: solo ADMIN (rol + issuer si existe) */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autenticado" });

  const isAdmin = u.role === "admin";
  // Si viene issuer en el token, que coincida; si no viene, no bloquea
  const issuerOk = !u.iss || u.iss === JWT_ISS;

  if (!(isAdmin && issuerOk)) {
    console.log("[requireAdmin] user payload:", u); // 👈 Debug temporal
    return res.status(403).json({ message: "Requiere rol admin" });
  }
  next();
}

/** ✅ Guard: solo CLIENT (rol + audience) */
export function requireClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * ✅ Guard para endpoints de lectura: permite admin o client autenticado.
 */
export function allowAnyAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autenticado" });

  // Admin válido (si viene issuer, debe coincidir)
  if (u.role === "admin" && (!u.iss || u.iss === JWT_ISS)) return next();

  // Client válido
  const hasAud = Array.isArray(u.aud)
    ? u.aud.includes(JWT_AUD)
    : u.aud === JWT_AUD;
  if (u.role === "client" && hasAud) return next();

  return res.status(403).json({ message: "Prohibido" });
}
