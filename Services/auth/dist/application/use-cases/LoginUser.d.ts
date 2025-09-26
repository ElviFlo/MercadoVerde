import { IUserRepository } from "../../domain/repositories/IUserRepository";
export declare class LoginUser {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, password: string): Promise<string>;
}
