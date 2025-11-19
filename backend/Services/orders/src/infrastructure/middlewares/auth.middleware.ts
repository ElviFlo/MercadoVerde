import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ISS = process.env.JWT_ISS!;
const JWT_AUD = process.env.JWT_AUD!;

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

// 👇 declara req.user para todo el proyecto
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Falta Bearer token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = req.user;
  const ok = u && u.role === "admin" && u.iss === JWT_ISS;
  if (!ok) return res.status(403).json({ message: "Requiere rol admin" });
  next();
}

export function requireClient(req: Request, res: Response, next: NextFunction) {
  const u = req.user;
  const hasAud =
    u && (Array.isArray(u.aud) ? u.aud.includes(JWT_AUD) : u?.aud === JWT_AUD);
  const ok = u && u.role === "client" && hasAud;
  if (!ok) return res.status(403).json({ message: "Requiere rol client" });
  next();
}

export function requireAdminOrOwner() {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const u = _req.user;
    if (!u) return _res.status(401).json({ message: "No autenticado" });
    if (u.role === "admin" && u.iss === JWT_ISS) return next();
    // si no es admin, el controller validará ownership comparando order.userId con u.sub
    return next();
  };
}
