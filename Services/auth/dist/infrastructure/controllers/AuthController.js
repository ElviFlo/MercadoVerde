"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const RegisterUser_1 = require("../../application/use-cases/RegisterUser");
const LoginUser_1 = require("../../application/use-cases/LoginUser");
const ValidateToken_1 = require("../../application/use-cases/ValidateToken");
const UserRepository_1 = require("../repositories/UserRepository");
const repo = new UserRepository_1.UserRepository();
class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const useCase = new RegisterUser_1.RegisterUser(repo);
            const user = await useCase.execute(username, email, password);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const useCase = new LoginUser_1.LoginUser(repo);
            const token = await useCase.execute(username, password);
            res.json({ token });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async validate(req, res) {
        try {
            const { token } = req.body;
            const useCase = new ValidateToken_1.ValidateToken();
            const decoded = await useCase.execute(token);
            res.json({ valid: true, decoded });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map