// auth/src/infrastructure/controllers/auth.controller.ts
import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { ValidateToken } from "../../application/use-cases/ValidateToken";
import { UserRepository } from "../repositories/UserRepository";
import { sign, type SignOptions } from "jsonwebtoken";

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

  /**
   * Login de cliente
   * Acepta email O name + password
   * BLOQUEA si el usuario es admin (no debe poder entrar aquí)
   */
   static async login(req: Request, res: Response) {
     try {
       const { email, name, password } = req.body ?? {};
       if ((!email && !name) || !password) {
         return res
           .status(400)
           .json({ message: "Debes enviar email o name, y el password" });
       }

       const { role, token } = await loginUser.execute({ email, name }, password);

       // 👇 Normalizamos el rol
       const normalizedRole = (role ?? "").toLowerCase();

       // 🔒 Blindaje: este endpoint es SOLO para clientes
       if (normalizedRole !== "client") {
         return res.status(403).json({ message: "Prohibido: solo client" });
       }

       return res.status(200).json({ role: normalizedRole, accessToken: token });
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

  /**
   * Login de admin
   * Acepta email O name + password
   * Valida contra ADMIN_EMAIL / ADMIN_NAME y ADMIN_PASSWORD
   * Emite token con rol=admin
   */
  static async loginAdmin(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body ?? {};
      const identifier = (email ?? name)?.trim();

      if (!identifier || !password) {
        return res
          .status(400)
          .json({ message: "Debes enviar email o name, y el password" });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminName = process.env.ADMIN_NAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      const jwtSecret = process.env.JWT_SECRET as string;
      if (!jwtSecret) {
        return res.status(500).json({ message: "JWT_SECRET no configurado" });
      }

      const jwtIss = process.env.JWT_ISS || undefined;
      const jwtAud = process.env.JWT_AUD || undefined;
      const accessTtl = (process.env.JWT_ACCESS_TTL ?? "2h") as SignOptions["expiresIn"];

      // Validar credenciales por email O name
      const identifierOk =
        (email && adminEmail && email === adminEmail) ||
        (name && adminName && name === adminName);

      if (!identifierOk || password !== adminPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const payload = {
        sub: "superadmin",
        role: "admin" as const,
        email: adminEmail,
        name: adminName,
      };

      const options: SignOptions = {
        expiresIn: accessTtl,
        issuer: jwtIss,
        audience: jwtAud,
      };

      const token = sign(payload, jwtSecret, options);

      return res.status(200).json({ role: "admin", accessToken: token });
    } catch (err) {
      console.error("[auth] Error en loginAdmin:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
