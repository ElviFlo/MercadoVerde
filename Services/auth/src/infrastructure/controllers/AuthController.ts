import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { ValidateToken } from "../../application/use-cases/ValidateToken";
import { UserRepository } from "../repositories/UserRepository";

const repo = new UserRepository();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const useCase = new RegisterUser(repo);
      const user = await useCase.execute(username, email, password);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const useCase = new LoginUser(repo);
      const token = await useCase.execute(username, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const useCase = new ValidateToken();
      const decoded = await useCase.execute(token);
      res.json({ valid: true, decoded });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
