// auth/src/application/use-cases/RegisterUser.ts
import * as bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

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

    // 3) Crear entidad (rol = client)
    const user = new User(
      0, // id lo asigna DB (autoincrement)
      name.trim(),
      email.trim().toLowerCase(),
      hashed,
      "client", // 👈 siempre cliente en el registro
    );

    // 4) Persistir
    await this.userRepository.create(user);
  }
}
