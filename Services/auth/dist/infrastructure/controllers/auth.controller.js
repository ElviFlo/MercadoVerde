"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    static async register(req, res) {
        return res.json({ message: "Usuario registrado" });
    }
    static async login(req, res) {
        return res.json({ token: "fake-jwt-token" });
    }
    static async validate(req, res) {
        return res.json({ valid: true });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map