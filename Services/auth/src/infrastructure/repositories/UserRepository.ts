import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username) || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
