import { IUserRepository } from "../../domain/repositories/IUserRepository";
import * as bcrypt from "bcrypt";
import { jwtConfig } from "../../infrastructure/config/jwt.config";

import * as jwt from "jsonwebtoken";

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new Error("Credenciales inválidas");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Credenciales inválidas");

    return jwt.sign(
      { id: user.id, username: user.username },
      jwtConfig.secret as jwt.Secret,
      { expiresIn: "1h" }
    );
  }
}
