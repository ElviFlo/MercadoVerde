import { Request, Response, NextFunction } from "express";
import { ValidateToken } from "../../application/use-cases/ValidateToken";

const validateToken = new ValidateToken();

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Falta Bearer token" });
  try {
    (req as any).user = await validateToken.execute(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
