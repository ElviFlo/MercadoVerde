import jwt from "jsonwebtoken";
import { Request } from "express";

export function getUserIdFromRequest(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  const token = h.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, {
      issuer: process.env.JWT_ISS || undefined,
      audience: process.env.JWT_AUD || undefined,
    }) as any;

    // adapta al claim que emite tu auth (sub | id | userId)
    return payload?.sub || payload?.id || payload?.userId || null;
  } catch {
    return null;
  }
}
