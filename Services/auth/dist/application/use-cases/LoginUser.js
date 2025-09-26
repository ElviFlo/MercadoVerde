"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
const bcrypt = require("bcrypt");
const jwt_config_1 = require("../../infrastructure/config/jwt.config");
const jwt = require("jsonwebtoken");
class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(username, password) {
        const user = await this.userRepository.findByUsername(username);
        if (!user)
            throw new Error("Credenciales inválidas");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            throw new Error("Credenciales inválidas");
        return jwt.sign({ id: user.id, username: user.username }, jwt_config_1.jwtConfig.secret, { expiresIn: "1h" });
    }
}
exports.LoginUser = LoginUser;
//# sourceMappingURL=LoginUser.js.map