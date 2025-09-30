// auth/src/application/use-cases/LoginUser.ts
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { jwtConfig } from "../../infrastructure/config/jwt.config";
import type { User } from "../../domain/entities/User";

export class LoginUser {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Login por email o por name (username).
   * Se firma el JWT según el rol persistido en DB:
   *  - admin  -> issuer (iss = JWT_ISS)
   *  - client -> audience (aud = JWT_AUD)
   */
  async execute(
    identifier: { email?: string; name?: string },
    password: string,
  ): Promise<{ role: User["role"]; token: string }> {
    const { email, name } = identifier;

    if (!email && !name) {
      throw new Error("Debes enviar email o name para iniciar sesión");
    }

    // Recuperar usuario desde el repositorio
    // Asegúrate de que tu UserRepository implemente estos métodos:
    // - findByEmail(email: string): Promise<User | null>
    // - findByName(name: string): Promise<User | null>
    let user: User | null = null;
    if (email)
      user = await this.userRepository.findByEmail(email.trim().toLowerCase());
    if (!user && name) user = await this.userRepository.findByName(name.trim());

    if (!user) throw new Error("Credenciales inválidas");

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Credenciales inválidas");

    // Construir payload
    const payload = {
      sub: user.id, // id Int (autoincrement)
      name: user.name, // tu campo real
      email: user.email, // útil para otros servicios
      role: user.role, // 'admin' | 'client'
    };

    // Opciones comunes de expiración
    const common: jwt.SignOptions = {
      expiresIn: jwtConfig.accessTtl,
    };

    // Firmado según rol
    const signOpts: jwt.SignOptions =
      user.role === "admin"
        ? { ...common, issuer: jwtConfig.issuer } // admin -> iss
        : { ...common, audience: jwtConfig.audience }; // client -> aud

    const token = jwt.sign(payload, jwtConfig.secret as jwt.Secret, signOpts);
    return { role: user.role, token };
  }
}
