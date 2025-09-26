import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import * as bcrypt from "bcrypt";

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByUsername(username);
    if (existing) {
      throw new Error("Usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(Date.now().toString(), username, hashedPassword, email);
    return await this.userRepository.create(user);
  }
}
