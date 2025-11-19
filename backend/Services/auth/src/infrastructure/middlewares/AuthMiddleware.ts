import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

function getBearer(req: Request): string | null {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearer(req);
    if (!token) return res.status(401).json({ message: "Falta Bearer token" });
    const payload = jwt.verify(token, jwtConfig.secret) as any;
    (req as any).user = payload;
    return next();
  } catch (e: any) {
    return res.status(401).json({ message: e?.message ?? "Token inválido" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "No autenticado" });
  if (user.role !== "admin" || user.iss !== jwtConfig.issuer) {
    return res
      .status(403)
      .json({ message: "Requiere rol admin (iss inválido o role incorrecto)" });
  }
  return next();
}

export function requireClient(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "No autenticado" });
  if (user.role !== "client" || user.aud !== jwtConfig.audience) {
    return res
      .status(403)
      .json({
        message: "Requiere rol client (aud inválido o role incorrecto)",
      });
  }
  return next();
}
