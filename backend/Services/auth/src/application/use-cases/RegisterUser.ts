// auth/src/application/use-cases/RegisterUser.ts
import * as bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Registra un usuario con rol 'client' por defecto.
   * - Enforce: email único
   * - Hash de contraseña
   */
  async execute(name: string, email: string, password: string): Promise<void> {
    // 1) Unicidad por email
    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail) {
      throw new Error("El email ya está registrado");
    }

    // 2) Hash de contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 3) Crear entidad (rol = client). id lo asigna la DB (UUID)
    const user = new User(
      "", // id: string (UUID) → lo asigna la DB
      name.trim(),
      email.trim().toLowerCase(),
      hashed,
      "client",
    );

    // 4) Persistir
    await this.userRepository.create(user);
  }
}
