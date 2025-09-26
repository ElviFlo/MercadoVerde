import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
export declare class UserRepository implements IUserRepository {
    private users;
    findByUsername(username: string): Promise<User | null>;
    create(user: User): Promise<User>;
}
