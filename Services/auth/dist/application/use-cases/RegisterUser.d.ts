import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
export declare class RegisterUser {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, email: string, password: string): Promise<User>;
}
