import * as jwt from "jsonwebtoken";
import { jwtConfig } from "../../infrastructure/config/jwt.config";

export class ValidateToken {
  async execute(token: string): Promise<any> {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch {
      throw new Error("Token inválido o expirado");
    }
  }
}
