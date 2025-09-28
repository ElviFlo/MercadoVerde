// src/infrastructure/controllers/auth.controller.ts
import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { ValidateToken } from "../../application/use-cases/ValidateToken";
import { UserRepository } from "../repositories/UserRepository"; 

const userRepository = new UserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const validateToken = new ValidateToken();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      await registerUser.execute(username, email, password);
      return res.status(201).json({ message: "Usuario registrado" });
    } catch (e: any) {
      return res.status(400).json({ message: e?.message ?? "Error registrando usuario" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const accessToken = await loginUser.execute(username, password); // tu use-case retorna el JWT string
      return res.status(200).json({ accessToken });
    } catch (e: any) {
      return res.status(401).json({ message: e?.message ?? "Credenciales inválidas" });
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Falta Bearer token" });
      const payload = await validateToken.execute(token);
      return res.json({ valid: true, payload });
    } catch {
      return res.status(401).json({ valid: false, message: "Token inválido o expirado" });
    }
  }
}
