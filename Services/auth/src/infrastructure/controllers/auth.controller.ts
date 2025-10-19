// auth/src/infrastructure/controllers/auth.controller.ts
import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { ValidateToken } from "../../application/use-cases/ValidateToken";
import { UserRepository } from "../repositories/UserRepository";
import jwt from "jsonwebtoken";

// Inyección básica
const userRepository = new UserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const validateToken = new ValidateToken();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body ?? {};
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "name, email y password son requeridos" });
      }
      await registerUser.execute(name, email, password);
      return res.status(201).json({ message: "Usuario registrado" });
    } catch (e: any) {
      return res
        .status(400)
        .json({ message: e?.message ?? "Error registrando usuario" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body ?? {};
      if ((!email && !name) || !password) {
        return res
          .status(400)
          .json({ message: "Debes enviar email o name, y el password" });
      }

      const { role, token } = await loginUser.execute({ email, name }, password);
      return res.status(200).json({ role, accessToken: token });
    } catch (e: any) {
      return res
        .status(401)
        .json({ message: e?.message ?? "Credenciales inválidas" });
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token)
        return res.status(401).json({ message: "Falta Bearer token" });

      const payload = await validateToken.execute(token);
      return res.json({ valid: true, payload });
    } catch {
      return res
        .status(401)
        .json({ valid: false, message: "Token inválido o expirado" });
    }
  }

  // ✅ Nuevo método para login de admin
  static async loginAdmin(req: Request, res: Response) {
    try {
      const { email, password } = req.body ?? {};

      if (!email || !password)
        return res.status(400).json({ message: "email y password son requeridos" });

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const jwtSecret = process.env.JWT_SECRET!;

      if (email !== adminEmail || password !== adminPassword)
        return res.status(401).json({ message: "Credenciales inválidas" });

      const token = jwt.sign(
        {
          sub: "superadmin",
          name: "superadmin",
          email,
          role: "admin",
        },
        jwtSecret,
        { expiresIn: "15m", audience: "mercadoverde-clients" }
      );

      return res.status(200).json({ role: "admin", accessToken: token });
    } catch (err) {
      console.error("[auth] Error en loginAdmin:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
