import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Falta el token Bearer en el header" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("⚠️ JWT_SECRET no configurado en .env");
    return res.status(500).json({ message: "Error interno: falta JWT_SECRET" });
  }

  try {
    // Opcional: validar issuer y audience si están definidos en .env
    const options: jwt.VerifyOptions = {};
    if (process.env.JWT_ISS) options.issuer = process.env.JWT_ISS;
    if (process.env.JWT_AUD) options.audience = process.env.JWT_AUD;

    const payload = jwt.verify(token, secret, options);
    (req as any).user = payload; // guardamos el payload en la request
    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
