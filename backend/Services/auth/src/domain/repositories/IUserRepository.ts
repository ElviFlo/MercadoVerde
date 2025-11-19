import { User, UserRole } from "../entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  create(user: User): Promise<void>;
  updateRole(userId: string, role: UserRole): Promise<void>;
}
