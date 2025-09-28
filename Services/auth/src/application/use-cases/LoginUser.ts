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

    const payload = { id: user.id, username: user.username };

    const signOpts: jwt.SignOptions = {
      expiresIn: jwtConfig.accessTtl,  // 👈 ahora está tipado bien
    };
    if (jwtConfig.issuer) signOpts.issuer = jwtConfig.issuer;
    if (jwtConfig.audience) signOpts.audience = jwtConfig.audience;

    return jwt.sign(payload, jwtConfig.secret as jwt.Secret, signOpts);
  }
}
