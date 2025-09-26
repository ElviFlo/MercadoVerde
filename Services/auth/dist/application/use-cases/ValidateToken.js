"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = void 0;
const jwt = require("jsonwebtoken");
const jwt_config_1 = require("../../infrastructure/config/jwt.config");
class ValidateToken {
    async execute(token) {
        try {
            return jwt.verify(token, jwt_config_1.jwtConfig.secret);
        }
        catch (_a) {
            throw new Error("Token inválido o expirado");
        }
    }
}
exports.ValidateToken = ValidateToken;
//# sourceMappingURL=ValidateToken.js.map