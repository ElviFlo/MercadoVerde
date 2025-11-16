import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`[voice] Falta env ${name}`);
  return v;
}

const JWT_SECRET = requireEnv("JWT_SECRET");

export interface AuthRequest extends Request {
  user?: JwtPayload | any;
  token?: string; // 👈 aquí guardamos el JWT crudo (sin "Bearer ")
}

export type JwtPayload = {
  sub?: string;
  id?: string;
  username?: string;
  role?: "admin" | "client";
  [k: string]: any;
};

export function verifyAccessToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];

  if (!token) {
    return res.status(401).json({ message: "Falta Bearer token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = payload.sub || payload.id;
    req.user = { ...payload, sub: userId };
    req.token = token; // 👈 guardar el JWT crudo para reenviarlo al Cart

    return next();
  } catch (e: any) {
    const code = e?.name === "TokenExpiredError" ? 401 : 403;
    return res.status(code).json({ message: "Token inválido" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autenticado" });
  if (u.role !== "admin")
    return res.status(403).json({ message: "Solo admin" });
  return next();
}
