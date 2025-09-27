import { Request, Response } from "express";

export class AuthController {
  static async register(req: Request, res: Response) {
    // tu lógica de registro
    return res.json({ message: "Usuario registrado" });
  }

  static async login(req: Request, res: Response) {
    // tu lógica de login
    return res.json({ token: "fake-jwt-token" });
  }

  static async validate(req: Request, res: Response) {
    // tu lógica de validación
    return res.json({ valid: true });
  }
}
