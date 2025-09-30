// auth/src/infrastructure/controllers/auth.controller.ts
import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { ValidateToken } from "../../application/use-cases/ValidateToken";
import { UserRepository } from "../repositories/UserRepository";

// Inyección básica (mantén tu estilo actual)
const userRepository = new UserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const validateToken = new ValidateToken();

export class AuthController {
  /**
   * POST /auth/register
   * Body: { name, email, password }
   * Crea SIEMPRE rol 'client' (la promoción a admin se hace aparte).
   */
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
   * POST /auth/login
   * Body: { email, password }  o  { name, password }
   * Respuesta: { role, accessToken }
   * Firma el token según el rol que está en DB (admin -> iss, client -> aud).
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body ?? {};
      if ((!email && !name) || !password) {
        return res
          .status(400)
          .json({ message: "Debes enviar email o name, y el password" });
      }

      const { role, token } = await loginUser.execute(
        { email, name },
        password,
      );
      return res.status(200).json({ role, accessToken: token });
    } catch (e: any) {
      return res
        .status(401)
        .json({ message: e?.message ?? "Credenciales inválidas" });
    }
  }

  /**
   * GET /auth/validate
   * Header: Authorization: Bearer <token>
   * Respuesta: { valid: boolean, payload?: any }
   */
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
}
