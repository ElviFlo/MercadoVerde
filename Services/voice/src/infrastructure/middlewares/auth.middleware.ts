import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`[voice] Falta env ${name}`);
  return v;
}

const JWT_SECRET = requireEnv("JWT_SECRET");
const JWT_ISS = process.env.JWT_ISS;
const JWT_AUD = process.env.JWT_AUD;
const JWT_ALG = (process.env.JWT_ALG ?? "HS256") as jwt.Algorithm;

type JwtPayload =
  | { sub?: string; id?: string; username?: string; role?: "admin" | "client"; [k: string]: any }
  | string;

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const token = m?.[1];
  if (!token) return res.status(401).json({ message: "Falta Bearer token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALG],
      issuer: JWT_ISS,
      audience: JWT_AUD,
      clockTolerance: 5,
    }) as JwtPayload;

    const userId = typeof payload === "string" ? undefined : (payload.sub || payload.id);
    (req as any).user = { ...(typeof payload === "string" ? {} : payload), sub: userId };
    return next();
  } catch (e: any) {
    const code = e?.name === "TokenExpiredError" ? 401 : 403;
    return res.status(code).json({ message: "Token inválido" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user;
  if (!u) return res.status(401).json({ message: "No autenticado" });
  if (u.role !== "admin") return res.status(403).json({ message: "Solo admin" });
  return next();
}
