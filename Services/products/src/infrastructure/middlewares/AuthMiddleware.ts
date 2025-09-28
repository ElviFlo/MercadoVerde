import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim() === "") {
    throw new Error(`[products] Falta la variable de entorno ${name}`);
  }
  return val;
}

const SECRET = requireEnv("JWT_SECRET");
const JWT_ALG = process.env.JWT_ALG || "HS256";
const JWT_ISS = process.env.JWT_ISS; // opcional si lo firmas en auth
const JWT_AUD = process.env.JWT_AUD; // opcional si lo firmas en auth

type JwtUserPayload =
  | { sub?: string; id?: string; username?: string; role?: string; [k: string]: any }
  | string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const match = typeof authHeader === "string" ? authHeader.match(/^Bearer\s+(.+)$/i) : null;
  const token = match?.[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido. Usa 'Authorization: Bearer <token>'" });
  }

  try {
    const payload = jwt.verify(token, SECRET, {
      algorithms: [JWT_ALG as jwt.Algorithm],
      issuer: JWT_ISS,
      audience: JWT_AUD,
      clockTolerance: 5,
    }) as JwtUserPayload;

    // Soporta tu payload actual { id, username } y también futuro { sub }
    const userId = typeof payload === "string" ? undefined : (payload.sub || payload.id);
    (req as any).user = { ...(typeof payload === "string" ? {} : payload), userId };

    return next();
  } catch (e: any) {
    console.error("[products] JWT ERROR:", e?.name, e?.message);
    const code = e?.name === "TokenExpiredError" ? 401 : 403;
    return res.status(code).json({ message: "Token inválido" });
  }
};
