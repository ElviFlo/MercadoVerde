"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = void 0;
const User_1 = require("../../domain/entities/User");
const bcrypt = require("bcrypt");
class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(username, email, password) {
        const existing = await this.userRepository.findByUsername(username);
        if (existing) {
            throw new Error("Usuario ya existe");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User_1.User(Date.now().toString(), username, hashedPassword, email);
        return await this.userRepository.create(user);
    }
}
exports.RegisterUser = RegisterUser;
//# sourceMappingURL=RegisterUser.js.map